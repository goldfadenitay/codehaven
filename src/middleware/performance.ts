import { Request, Response, NextFunction } from 'express'
import { createRequestLogger } from '@/common/utils/logger'

export const performanceMonitor = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const startTime = Date.now()
  const requestLogger = createRequestLogger(req, startTime)

  requestLogger.info('Request started')

  res.on('finish', () => {
    requestLogger.end(res)
  })

  next()
}
