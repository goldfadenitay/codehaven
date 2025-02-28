import { StatusCodes } from 'http-status-codes'

/**
 * Base application error class that extends the native Error
 * Provides functionality for HTTP status codes, error codes, and more details
 */
export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean
  public readonly errorCode: string
  public readonly details?: Record<string, unknown>

  constructor(
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    errorCode: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
    details?: Record<string, unknown>,
  ) {
    super(message)

    this.statusCode = statusCode
    this.isOperational = isOperational
    this.errorCode = errorCode
    this.details = details

    // Ensures proper stack trace for debugging
    Error.captureStackTrace(this, this.constructor)

    Object.setPrototypeOf(this, AppError.prototype)
  }
}
