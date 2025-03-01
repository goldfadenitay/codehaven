import { Request, Response, NextFunction } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { logger } from '@/common/utils/logger'
import { getUserAgent, getClientIp } from '@/common/utils/request'
import { momentUTC } from '@/common/utils/momentUTC'
import { RequestMetadata } from '@/types/express'

/**
 * Middleware to add trace ID and request metadata to each request
 */
export const traceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Generate a unique trace ID for this request
  const traceId = (req.headers['x-trace-id'] as string) || uuidv4()

  // Set trace ID in request object
  ;(req as any).traceId = traceId

  // Set trace ID in response headers
  res.setHeader('X-Trace-ID', traceId)

  // Set trace ID in logger context
  logger.setTraceId(traceId)

  // Record request start time
  ;(req as any).startTime = momentUTC.now().toDate()

  // Add request metadata
  const metadata: RequestMetadata = {
    method: req.method,
    path: req.path,
    ip: getClientIp(req),
    userAgent: getUserAgent(req),
    startTimestamp: momentUTC.now().toDate(),
    query: req.query,
    headers: req.headers,
    protocol: req.protocol,
    host: req.get('host'),
    referrer: req.get('referrer'),
  }

  ;(req as any).requestMetadata = metadata

  // Log request start
  logger.info({
    message: `Request started: ${req.method} ${req.path}`,
    method: req.method,
    path: req.path,
    query: req.query,
  })

  // Log request completion and duration on response finish
  res.on('finish', () => {
    const duration = momentUTC.now().diff((req as any).startTime, 'ms')
    const statusCode = res.statusCode

    logger.info({
      message: `Request completed: ${req.method} ${req.path} ${statusCode}`,
      method: req.method,
      path: req.path,
      statusCode,
      duration,
      durationFormatted: `${duration}ms`,
    })
  })

  next()
}
