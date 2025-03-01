import express, { RequestHandler, Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import config from 'config'
import { errorHandler } from '@/common/errors/errorHandler'
import { momentUTC } from '@/common/utils/momentUTC'
import v1Routes from '@/routes/v1/index'
import os from 'os'

// Import request ID middleware
import { addRequestId } from '@/middleware/request-id'
import { performanceMonitor } from '@/middleware/performance'

const app: Application = express()

// Add request ID first for logging
app.use(addRequestId)
// performance monitoring
app.use(performanceMonitor)

const corsOptions = config.get<cors.CorsOptions>('cors')
app.use(cors(corsOptions)) // CORS configuration
app.use(helmet()) // Security headers
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// TODO: Rate limiting

app.get('/health', (_req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: momentUTC.utc().toISOString(),
    memory: process.memoryUsage(),
    cpu: os.cpus(),
    loadavg: os.loadavg(),
    version: process.env.npm_package_version ?? 'unknown',
    environment: process.env.NODE_ENV ?? 'development',
  }

  res.status(200).json(health)
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

export { app }
