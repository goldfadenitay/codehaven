import { type Request, type Response, type NextFunction } from 'express'
import { AppError } from '@common/errors/AppError.js'
import { StatusCodes } from 'http-status-codes'
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library'
import { logger } from '@common/utils/logger.js'
import { ZodError } from 'zod'
import { match, P } from 'ts-pattern'
import { momentUTC } from '@common/utils/momentUTC.js'

interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
  timestamp: string
  path: string
  traceId?: string
}

/**
 * Convert various error types to AppError using pattern matching
 */
export const convertToAppError = (err: unknown): AppError => {
  return (
    match(err)
      // Already an AppError, return as is
      .when(
        (error): error is AppError => error instanceof AppError,
        (error) => error,
      )
      // Handle Prisma known request errors using nested pattern matching
      .when(
        (error): error is PrismaClientKnownRequestError =>
          error instanceof PrismaClientKnownRequestError,
        (error) =>
          match(error.code)
            // Unique constraint violation
            .with(
              'P2002',
              () =>
                new AppError(
                  'A record with this data already exists',
                  StatusCodes.CONFLICT,
                  'DATABASE_UNIQUE_CONSTRAINT',
                  true,
                  { target: error.meta?.target },
                ),
            )
            // Record not found
            .with(
              'P2025',
              () =>
                new AppError(
                  'Resource not found',
                  StatusCodes.NOT_FOUND,
                  'DATABASE_RECORD_NOT_FOUND',
                  true,
                ),
            )
            // Default case for other Prisma error codes
            .otherwise(
              (code) =>
                new AppError(
                  'Database error occurred',
                  StatusCodes.INTERNAL_SERVER_ERROR,
                  `DATABASE_ERROR_${code}`,
                  true,
                  { code: error.code, meta: error.meta },
                ),
            ),
      )
      // Handle Prisma validation errors
      .when(
        (error): error is PrismaClientValidationError =>
          error instanceof PrismaClientValidationError,
        () =>
          new AppError(
            'Invalid data provided',
            StatusCodes.BAD_REQUEST,
            'DATABASE_VALIDATION_ERROR',
            true,
          ),
      )
      // Handle Zod validation errors
      .when(
        (error): error is ZodError => error instanceof ZodError,
        (error) =>
          new AppError(
            'Validation error',
            StatusCodes.UNPROCESSABLE_ENTITY,
            'VALIDATION_ERROR',
            true,
            { errors: error.format() },
          ),
      )
      // Handle standard errors
      .when(
        (error): error is Error => error instanceof Error,
        (error) =>
          new AppError(
            error.message,
            StatusCodes.INTERNAL_SERVER_ERROR,
            'UNEXPECTED_ERROR',
            false,
          ),
      )
      // Handle unknown errors
      .otherwise(
        () =>
          new AppError(
            'An unexpected error occurred',
            StatusCodes.INTERNAL_SERVER_ERROR,
            'UNKNOWN_ERROR',
            false,
          ),
      )
  )
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  const appError = convertToAppError(err)

  // Log error details based on operational status using pattern matching
  match(appError)
    .when(
      (error) => error.isOperational,
      (error) => {
        logger.warn({
          message: error.message,
          errorCode: error.errorCode,
          statusCode: error.statusCode,
          details: error.details,
          path: req.path,
          method: req.method,
        })
      },
    )
    .otherwise((error) => {
      logger.error({
        message: error.message,
        errorCode: error.errorCode,
        statusCode: error.statusCode,
        stack: error.stack,
        path: req.path,
        method: req.method,
      })
    })

  // Prepare response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: appError.errorCode,
      message: appError.message,
      ...(appError.details && { details: appError.details }),
    },
    timestamp: momentUTC.now().toISOString(),
    path: req.originalUrl,
    traceId: req.traceId,
  }

  // Send response
  res.status(appError.statusCode).json(errorResponse)
}

/**
 * Async handler to catch errors in async routes and pass to error handler
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
