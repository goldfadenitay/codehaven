import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '@common/utils/logger.js'
import { getUserAgent } from '@common/utils/request.js'
import { momentUTC } from '@common/utils/momentUTC.js'

// Interface for request metadata
interface RequestMetadata {
  ip: string
  userAgent?: string
  method: string
  path: string
  query: Record<string, any>
  headers: Record<string, any>
  protocol: string
  host?: string
  referrer?: string
}

/**
 * Generate a unique trace ID for the request
 * If the X-Trace-ID header exists, use that instead
 */
export const generateTraceId = (req: Request): string => {
  return (req.headers['x-trace-id'] as string) ?? uuidv4()
}

/**
 * Collect metadata about the request
 */
export const collectRequestMetadata = (req: Request): RequestMetadata => {
  const { headers, method, path, query, protocol } = req

  const userAgent = getUserAgent(req)

  const metadata: RequestMetadata = {
    ip: req.ip ?? req.socket.remoteAddress ?? '',
    userAgent,
    method,
    path,
    query,
    headers: { ...headers },
    protocol,
    host: typeof req.headers.host === 'string' ? req.headers.host : undefined,
    referrer:
      typeof req.headers.referer === 'string'
        ? req.headers.referer
        : typeof req.headers.referrer === 'string'
          ? req.headers.referrer
          : undefined,
  }

  // Remove sensitive headers
  if (typeof metadata.headers.authorization === 'string') {
    metadata.headers.authorization = '[REDACTED]'
  }

  if (typeof metadata.headers.cookie === 'string') {
    metadata.headers.cookie = '[REDACTED]'
  }

  return metadata
}

/**
 * Middleware to add a trace ID to each request
 * Also logs request start and end with performance metrics
 */
export const traceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Add trace ID
  const traceId = generateTraceId(req)
  req.traceId = traceId

  // Add start time for performance measurement
  req.startTime = momentUTC.now().toDate()

  // Collect request metadata
  req.requestMetadata = collectRequestMetadata(req)

  // Set trace ID in response headers
  res.setHeader('X-Trace-ID', traceId)

  // Log request start
  logger.info({
    message: `Request started: ${req.method} ${req.path}`,
    traceId,
    requestMetadata: req.requestMetadata,
    timestamp: req.startTime.toISOString(),
  })

  // Capture response data
  const originalSend = res.send
  res.send = function (body?: any): Response {
    res.locals.body = body
    return originalSend.call(this, body)
  }

  // Add listener for response finish
  res.on('finish', () => {
    const endTime = momentUTC.now()
    const duration = endTime.diff(req.startTime, 'milliseconds')

    // Log request end with performance metrics
    logger.info({
      message: `Request completed: ${req.method} ${req.path}`,
      traceId,
      statusCode: res.statusCode,
      duration,
      startTime: req.startTime?.toISOString() ?? 'unknown',
      endTime: endTime.toISOString(),
      bytesSent: res.getHeader('content-length') ?? 0,
      contentType: res.getHeader('content-type') ?? 'unknown',
    })
  })

  next()
}
