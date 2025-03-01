import { type Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { momentUTC } from '@/common/utils/momentUTC'

interface SuccessResponse<T> {
  success: true
  data: T
  timestamp: string
  traceId?: string
}

interface PaginatedSuccessResponse<T> extends SuccessResponse<T[]> {
  pagination: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}

/**
 * Sends a success response with the provided data
 */
export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = StatusCodes.OK,
): Response => {
  const traceId = res.req.traceId

  const response: SuccessResponse<T> = {
    success: true,
    data,
    timestamp: momentUTC.now().toISOString(),
    ...(traceId && { traceId }),
  }

  return res.status(statusCode).json(response)
}

/**
 * Sends a paginated success response
 */
export const sendPaginatedSuccess = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  pageSize: number,
  statusCode: number = StatusCodes.OK,
): Response => {
  const totalPages = Math.ceil(total / pageSize)
  const traceId = res.req.traceId

  const response: PaginatedSuccessResponse<T> = {
    success: true,
    data,
    pagination: {
      total,
      page,
      pageSize,
      totalPages,
    },
    timestamp: momentUTC.now().toISOString(),
    ...(traceId && { traceId }),
  }

  return res.status(statusCode).json(response)
}

/**
 * Sends a no content response (204)
 */
export const sendNoContent = (res: Response): Response => {
  return res.status(StatusCodes.NO_CONTENT).send()
}

/**
 * Sends a created response (201) with the provided data
 */
export const sendCreated = <T>(res: Response, data: T): Response => {
  return sendSuccess(res, data, StatusCodes.CREATED)
}
