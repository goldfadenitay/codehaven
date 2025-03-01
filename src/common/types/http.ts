export interface HttpRequest {
  body: any
  query: Record<string, string>
  params: Record<string, string>
  headers: Record<string, string>
}

export interface HttpResponse {
  statusCode: number
  body: any
  headers?: Record<string, string>
}

export type Controller = (request: HttpRequest) => Promise<HttpResponse>
