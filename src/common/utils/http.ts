export type HTTP_STATUS = {
  readonly OK: 200
  readonly CREATED: 201
  readonly BAD_REQUEST: 400
  readonly UNAUTHORIZED: 401
  readonly FORBIDDEN: 403
  readonly NOT_FOUND: 404
  readonly CONFLICT: 409
  readonly INTERNAL_SERVER: 500
}

export const HttpStatus: HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER: 500,
} as const

export type HttpResponse<T> = {
  readonly statusCode: (typeof HttpStatus)[keyof typeof HttpStatus]
  readonly body: T
  readonly headers?: Readonly<Record<string, string>>
}

export type HttpRequest = Readonly<{
  body: unknown
  query: Readonly<Record<string, string>>
  params: Readonly<Record<string, string>>
  headers: Readonly<Record<string, string>>
}>
