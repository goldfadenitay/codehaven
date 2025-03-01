import pino from 'pino'
import config from 'config'
import { momentUTC } from '@common/utils/momentUTC'
import { AsyncLocalStorage } from 'async_hooks'
import { isDefined } from '@common/utils/isDefined'

// Trace context type
interface TraceContext {
  traceId?: string
}

// Create an AsyncLocalStorage instance for trace context
export const traceContextStorage = new AsyncLocalStorage<TraceContext>()

// Configure log level based on environment
const level = config.get<string>('logger.level') ?? 'info'

// Create a custom logger instance
const pinoLogger = pino({
  level,
  transport:
    process.env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  base: undefined,
  timestamp: () => `,"time":"${momentUTC.now().toISOString()}"`,
  // Custom serializers
  serializers: {
    err: pino.stdSerializers.err,
    error: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },
})

// Define the valid logging methods
type LoggerMethod = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

// Wrapper function to add trace ID to log entries
const logWithTraceId = (
  method: LoggerMethod,
  message: string | Record<string, any>,
  ...args: any[]
): void => {
  // Get trace context
  const traceContext = traceContextStorage.getStore()
  const traceId = traceContext?.traceId

  // If message is a string, convert to object
  const messageObject = typeof message === 'string' ? { message } : message

  // Add trace ID if available
  const payload = {
    ...messageObject,
    ...(isDefined(traceId) && { traceId }),
  }

  // Call the original logger method
  if (args.length > 0) {
    pinoLogger[method](payload, ...args)
  } else {
    pinoLogger[method](payload)
  }
}

// Create a wrapper logger
export const logger = {
  trace: (
    message: string | Record<string, any>,
    ...args: unknown[]
  ): ReturnType<typeof logWithTraceId> => {
    logWithTraceId('trace', message, ...args)
  },
  debug: (
    message: string | Record<string, any>,
    ...args: unknown[]
  ): ReturnType<typeof logWithTraceId> => {
    logWithTraceId('debug', message, ...args)
  },
  info: (
    message: string | Record<string, any>,
    ...args: unknown[]
  ): ReturnType<typeof logWithTraceId> => {
    logWithTraceId('info', message, ...args)
  },
  warn: (
    message: string | Record<string, any>,
    ...args: unknown[]
  ): ReturnType<typeof logWithTraceId> => {
    logWithTraceId('warn', message, ...args)
  },
  error: (
    message: string | Record<string, any>,
    ...args: unknown[]
  ): ReturnType<typeof logWithTraceId> => {
    logWithTraceId('error', message, ...args)
  },
  fatal: (
    message: string | Record<string, any>,
    ...args: unknown[]
  ): ReturnType<typeof logWithTraceId> => {
    logWithTraceId('fatal', message, ...args)
  },

  // Set trace ID for the current context
  setTraceId: (traceId: string): void => {
    const currentContext = traceContextStorage.getStore() ?? {}
    traceContextStorage.enterWith({ ...currentContext, traceId })
  },

  // Get the current trace ID
  getTraceId: (): string | undefined => {
    return traceContextStorage.getStore()?.traceId
  },
}
