import { StatusCodes } from 'http-status-codes'
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number,
    public readonly isOperational: boolean,
    public readonly details?: Record<string, unknown>,
    public readonly originalError?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }

  static badRequest(
    message: string,
    code: string = 'BAD_REQUEST',
    details?: Record<string, unknown>,
  ): AppError {
    return new AppError(message, code, StatusCodes.BAD_REQUEST, true, details)
  }

  static unauthorized(
    message: string,
    code: string = 'UNAUTHORIZED',
  ): AppError {
    return new AppError(message, code, StatusCodes.UNAUTHORIZED, true)
  }

  static forbidden(message: string, code: string = 'FORBIDDEN'): AppError {
    return new AppError(message, code, StatusCodes.FORBIDDEN, true)
  }

  static notFound(message: string, code: string = 'NOT_FOUND'): AppError {
    return new AppError(message, code, StatusCodes.NOT_FOUND, true)
  }

  static conflict(message: string, code: string = 'CONFLICT'): AppError {
    return new AppError(message, code, StatusCodes.CONFLICT, true)
  }

  static tooManyRequests(
    message: string,
    code: string = 'TOO_MANY_REQUESTS',
  ): AppError {
    return new AppError(message, code, StatusCodes.TOO_MANY_REQUESTS, true)
  }

  static internal(
    message: string = 'Internal Server Error',
    code: string = 'INTERNAL_ERROR',
    originalError?: unknown,
  ): AppError {
    return new AppError(
      message,
      code,
      StatusCodes.INTERNAL_SERVER_ERROR,
      true,
      {},
      originalError,
    )
  }
}
