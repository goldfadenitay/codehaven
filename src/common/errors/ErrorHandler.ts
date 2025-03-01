import { Request, Response, NextFunction } from 'express'
import { AppError } from '@/common/errors/AppError'
import { internalServer } from '@/common/utils/response'

interface ErrorResponse {
  error: string
  code: string
  details?: unknown
  originalError?: string
}

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _: NextFunction, // DO NOT REMOVE!
): void => {
  if (error instanceof AppError) {
    const response: ErrorResponse = {
      error: error.message,
      code: error.code,
      details: error.details,
    }

    if (process.env['NODE_ENV'] !== 'production' && error.originalError) {
      response['originalError'] = (error.originalError as Error).message
    }
    res.status(error.statusCode).json(response)
    return
  }

  const response = internalServer()
  res.status(response.statusCode).json(response.body)
}
