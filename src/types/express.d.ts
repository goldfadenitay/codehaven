import { Request as ExpressRequest } from 'express'

declare global {
  namespace Express {
    // Extend the Request interface
    interface Request {
      traceId: string
      startTime: Date
      requestMetadata: RequestMetadata
    }
  }
}

export interface RequestMetadata {
  method: string
  path: string
  ip: string
  userAgent?: string
  startTimestamp: Date
  query: Record<string, any>
  headers: Record<string, any>
  protocol: string
  host?: string
  referrer?: string
}

// This is a crucial step - augment the module directly
declare module 'express' {
  interface Request {
    traceId: string
    startTime: Date
    requestMetadata: RequestMetadata
  }
}
