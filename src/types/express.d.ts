import 'express'
interface RequestMetadata {
  userAgent?: string
  ip?: string
  method: string
  path: string
  query: Record<string, any>
  headers: Record<string, any>
  protocol: string
  host?: string
  referrer?: string
}

declare module 'express-serve-static-core' {
  interface Request {
    traceId?: string
    startTime?: Date
    requestMetadata?: RequestMetadata
  }
}
