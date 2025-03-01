import { HttpResponse, HttpStatus } from '@/common/utils/http'

type ErrorResponse = {
  error: string
  details?: unknown
}

const createResponse = <T>(
  statusCode: (typeof HttpStatus)[keyof typeof HttpStatus],
  body: T,
  headers?: Record<string, string>,
): HttpResponse<T> => ({
  statusCode,
  body,
  headers: headers ?? {},
})

export const success = <T>(data: T): HttpResponse<T> =>
  createResponse(HttpStatus.OK, data)

export const created = <T>(data: T): HttpResponse<T> =>
  createResponse(HttpStatus.CREATED, data)

export const badRequest = (
  message: string,
  details?: unknown,
): HttpResponse<ErrorResponse> =>
  createResponse(HttpStatus.BAD_REQUEST, { error: message, details })

export const unauthorized = (message: string): HttpResponse<ErrorResponse> =>
  createResponse(HttpStatus.UNAUTHORIZED, { error: message })

export const forbidden = (message: string): HttpResponse<ErrorResponse> =>
  createResponse(HttpStatus.FORBIDDEN, { error: message })

export const notFound = (message: string): HttpResponse<ErrorResponse> =>
  createResponse(HttpStatus.NOT_FOUND, { error: message })

export const conflict = (message: string): HttpResponse<ErrorResponse> =>
  createResponse(HttpStatus.CONFLICT, { error: message })

export const internalServer = (
  message: string = 'Internal Server Error',
): HttpResponse<ErrorResponse> =>
  createResponse(HttpStatus.INTERNAL_SERVER, { error: message })
