import { StatusCodes } from 'http-status-codes'
import { AppError } from '@common/errors/AppError.js'

/**
 * Not Found Error - For resources that cannot be found
 */
export class NotFoundError extends AppError {
  constructor(
    message: string = 'Resource not found',
    errorCode: string = 'RESOURCE_NOT_FOUND',
    details?: Record<string, unknown>,
  ) {
    super(message, StatusCodes.NOT_FOUND, errorCode, true, details)
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

/**
 * Bad Request Error - For invalid inputs
 */
export class BadRequestError extends AppError {
  constructor(
    message: string = 'Bad request',
    errorCode: string = 'BAD_REQUEST',
    details?: Record<string, unknown>,
  ) {
    super(message, StatusCodes.BAD_REQUEST, errorCode, true, details)
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }
}

/**
 * Unauthorized Error - For authentication failures
 */
export class UnauthorizedError extends AppError {
  constructor(
    message: string = 'Unauthorized',
    errorCode: string = 'UNAUTHORIZED',
    details?: Record<string, unknown>,
  ) {
    super(message, StatusCodes.UNAUTHORIZED, errorCode, true, details)
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

/**
 * Forbidden Error - For authorization failures
 */
export class ForbiddenError extends AppError {
  constructor(
    message: string = 'Forbidden',
    errorCode: string = 'FORBIDDEN',
    details?: Record<string, unknown>,
  ) {
    super(message, StatusCodes.FORBIDDEN, errorCode, true, details)
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}

/**
 * Conflict Error - For resource conflicts
 */
export class ConflictError extends AppError {
  constructor(
    message: string = 'Conflict',
    errorCode: string = 'CONFLICT',
    details?: Record<string, unknown>,
  ) {
    super(message, StatusCodes.CONFLICT, errorCode, true, details)
    Object.setPrototypeOf(this, ConflictError.prototype)
  }
}

/**
 * Validation Error - For input validation failures
 */
export class ValidationError extends AppError {
  constructor(
    message: string = 'Validation failed',
    errorCode: string = 'VALIDATION_ERROR',
    details?: Record<string, unknown>,
  ) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY, errorCode, true, details)
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

/**
 * Database Error - For database operation failures
 */
export class DatabaseError extends AppError {
  constructor(
    message: string = 'Database error',
    errorCode: string = 'DATABASE_ERROR',
    details?: Record<string, unknown>,
  ) {
    super(message, StatusCodes.INTERNAL_SERVER_ERROR, errorCode, true, details)
    Object.setPrototypeOf(this, DatabaseError.prototype)
  }
}
