import { type Request, type Response, type NextFunction } from 'express'
import { type AnyZodObject, ZodError } from 'zod'
import { ValidationError } from '@/common/errors/errorTypes'
import { logger } from '@/common/utils/logger'
import { isDefined } from '@/common/utils/isDefined'

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
export const validate = <T extends AnyZodObject>(
  schema: T,
  source: ValidationSource = ValidationSource.BODY,
  options: ValidationOptions = { stripUnknown: true },
) => {
  return (req: Request, _: Response, next: NextFunction): void => {
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
      if (error instanceof ZodError) {
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
  error: ZodError,
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
 * Middleware factory for validating request body against a Zod schema
 */
export const validateBody = (schema: AnyZodObject) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.body)
      req.body = validatedData
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new ValidationError('Invalid request body', 'INVALID_REQUEST_BODY', {
            errors: error.format(),
          }),
        )
      } else {
        next(error)
      }
    }
  }
}

/**
 * Middleware factory for validating request params against a Zod schema
 */
export const validateParams = (schema: AnyZodObject) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.params)
      req.params = validatedData
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new ValidationError(
            'Invalid request parameters',
            'INVALID_REQUEST_PARAMS',
            {
              errors: error.format(),
            },
          ),
        )
      } else {
        next(error)
      }
    }
  }
}

/**
 * Middleware factory for validating request query against a Zod schema
 */
export const validateQuery = (schema: AnyZodObject) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.query)
      req.query = validatedData
      next()

      return
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new ValidationError(
            'Invalid query parameters',
            'INVALID_QUERY_PARAMS',
            {
              errors: error.format(),
            },
          ),
        )
        return
      } else {
        next(error)
        return
      }
    }
  }
}

/**
 * Helper function to validate request headers
 */
export const validateHeaders = <T extends AnyZodObject>(
  schema: T,
  options?: ValidationOptions,
): ReturnType<typeof validate<T>> =>
  validate(schema, ValidationSource.HEADERS, options)
