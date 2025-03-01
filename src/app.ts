import express, { RequestHandler, Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import config from 'config'
import { errorHandler } from '@common/errors/ErrorHandler'
import { logger } from '@common/utils/logger'
import { traceMiddleware } from '@middleware/traceMiddleware'
import { momentUTC } from '@common/utils/momentUTC'
import v1Routes from './routes/v1/index'

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
  app.get('/health', (_, res) => {
    res.status(200).json({
      status: 'UP',
      timestamp: momentUTC.utc().toISOString(),
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
