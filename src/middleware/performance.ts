import { Request, Response, NextFunction } from 'express'
import { createRequestLogger } from '@/common/utils/logger'
import { momentUTC } from '@/common/utils/momentUTC'

export const performanceMonitor = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const startTime = momentUTC.now().utc().toISOString()
  const requestLogger = createRequestLogger(req, startTime)

  requestLogger.info('Request started')

  res.on('finish', () => {
    requestLogger.end(res)
  })

  next()
}
