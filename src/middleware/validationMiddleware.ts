import { type Request, type Response, type NextFunction } from 'express'
import { z } from 'zod'
import { ValidationError } from '@common/errors/ErrorTypes.js'
import { logger } from '@common/utils/logger.js'
import { isDefined } from '@/utils/isDefined.js'

/**
 * Validation sources in request
 */
export enum ValidationSource {
  BODY = 'body',
  QUERY = 'query',
  PARAMS = 'params',
  HEADERS = 'headers',
}

/**
 * Validation options
 */
export interface ValidationOptions {
  /**
   * Whether to strip unknown properties
   * Default: true
   */
  stripUnknown?: boolean

  /**
   * Custom error messages for specific fields
   */
  messages?: Record<string, string>
}

/**
 * Middleware factory to validate request using Zod schemas
 */
export const validate = <T extends z.ZodType>(
  schema: T,
  source: ValidationSource = ValidationSource.BODY,
  options: ValidationOptions = { stripUnknown: true },
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Get data from request based on source
      const data = req[source as keyof Request]

      // Parse and validate data
      const validated = schema.parse(data)

      // Replace request data with validated data
      ;(req as any)[source] = validated

      next()
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        logger.debug('Validation error', {
          path: req.path,
          source,
          errors: error.format(),
        })

        // Create a custom error with better formatting
        const formattedErrors = formatZodError(error, options.messages)

        next(
          new ValidationError('Validation failed', 'VALIDATION_ERROR', {
            source,
            errors: formattedErrors,
          }),
        )
      } else {
        // Pass other errors to next error handler
        next(error)
      }
    }
  }
}

/**
 * Format Zod errors into a more user-friendly format
 */
const formatZodError = (
  error: z.ZodError,
  customMessages?: Record<string, string>,
): Record<string, string> => {
  const formattedErrors: Record<string, string> = {}

  error.errors.forEach((err) => {
    const path = err.path.join('.')
    const field = err.path[err.path.length - 1] as string

    // Use custom message if provided
    if (isDefined(customMessages?.[field])) {
      formattedErrors[path] = customMessages[field]
    } else {
      formattedErrors[path] = err.message
    }
  })

  return formattedErrors
}

/**
 * Helper function to validate request body
 */
export const validateBody = <T extends z.ZodType>(
  schema: T,
  options?: ValidationOptions,
): ReturnType<typeof validate<T>> =>
  validate(schema, ValidationSource.BODY, options)

/**
 * Helper function to validate request query parameters
 */
export const validateQuery = <T extends z.ZodType>(
  schema: T,
  options?: ValidationOptions,
): ReturnType<typeof validate<T>> =>
  validate(schema, ValidationSource.QUERY, options)

/**
 * Helper function to validate request path parameters
 */
export const validateParams = <T extends z.ZodType>(
  schema: T,
  options?: ValidationOptions,
): ReturnType<typeof validate<T>> =>
  validate(schema, ValidationSource.PARAMS, options)

/**
 * Helper function to validate request headers
 */
export const validateHeaders = <T extends z.ZodType>(
  schema: T,
  options?: ValidationOptions,
): ReturnType<typeof validate<T>> =>
  validate(schema, ValidationSource.HEADERS, options)
