import express, {
  type RequestHandler,
  type Application,
  type Request,
  type Response,
} from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import config from 'config'
import { errorHandler } from '@common/errors/ErrorHandler.js'
import { logger } from '@common/utils/logger.js'
import { traceMiddleware } from '@middleware/traceMiddleware.js'
import { momentUTC } from '@common/utils/momentUTC.js'
import v1Routes from './routes/v1/index.js'

/**
 * Express application setup
 */
export const createApp = (): Application => {
  const app: Application = express()

  // Load configuration
  const corsOptions = config.get<cors.CorsOptions>('cors')
  const morganFormat = config.get<string>('logger.morganFormat')

  // Apply middleware
  app.use(helmet()) // Security headers
  app.use(cors(corsOptions)) // CORS configuration
  app.use(compression()) // Compress responses

  // Request tracing middleware - must be before request body parsing
  app.use(traceMiddleware as unknown as RequestHandler)

  app.use(express.json()) // Parse JSON bodies
  app.use(express.urlencoded({ extended: true })) // Parse URL-encoded bodies

  // Request logging
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message: string) => {
          logger.info(message.trim())
        },
      },
    }),
  )

  // Health check route
  app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'UP',
      timestamp: momentUTC.utc().toISOString(),
      traceId: req.traceId,
      version: process.env.npm_package_version ?? 'unknown',
      environment: process.env.NODE_ENV ?? 'development',
    })
  })

  // API Routes - versioned
  app.use('/api/v1', v1Routes)

  // Redirect base API path to latest version
  app.use('/api', (req, res) => {
    // Get the current path without /api prefix
    const path = req.originalUrl.replace(/^\/api/, '')
    // Redirect to the latest version
    res.redirect(301, `/api/v1${path}`)
  })

  // Error handling middleware (must be after routes)
  app.use(errorHandler as unknown as RequestHandler)

  return app
}
