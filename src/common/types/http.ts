export interface HttpRequest {
  body: unknown
  query: Record<string, string>
  params: Record<string, string>
  headers: Record<string, string>
}

export interface HttpResponse {
  statusCode: number
  body: unknown
  headers?: Record<string, string>
}

export type Controller = (request: HttpRequest) => Promise<HttpResponse>
