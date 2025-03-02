import { Request, Response } from 'express'
import winston from 'winston'
import { momentUTC } from './momentUTC'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: 'api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
})

if (process.env['NODE_ENV'] !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  )
}

export type LogContext = {
  requestId?: string
  method?: string
  url?: string
  statusCode?: number
  duration?: number
  error?: Error
}

export const createRequestLogger = (
  req: Request,
  startTime = momentUTC.now().utc().toISOString(),
): {
  info: (message: string, context?: Partial<LogContext>) => void
  error: (message: string, context?: Partial<LogContext>, error?: Error) => void
  end: (res: Response) => void
} => {
  const baseContext = {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
  }

  return {
    info: (message: string, context: Partial<LogContext> = {}): void => {
      logger.info(message, { ...baseContext, ...context })
    },
    error: (
      message: string,
      context: Partial<LogContext> = {},
      error?: Error,
    ): void => {
      logger.error(message, {
        ...baseContext,
        ...context,
        error: error
          ? {
              message: error.message,
              stack: error.stack,
            }
          : undefined,
      })
    },
    end: (res: Response): void => {
      const duration = Date.now() - startTime
      logger.info('Request completed', {
        ...baseContext,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      })
    },
  }
}

export { logger }
