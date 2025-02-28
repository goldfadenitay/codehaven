import { createApp } from './app.js'
import { logger } from '@common/utils/logger.js'
import config from 'config'
import {
  connectPrisma,
  disconnectPrisma,
  isPrismaConnected,
} from '@common/db/prisma.js'
import { momentUTC } from '@common/utils/momentUTC.js'

// Start the server
const startServer = async (): Promise<void> => {
  try {
    const startTime = momentUTC.now()

    // Connect to the database
    await connectPrisma()

    // Create the Express app
    const app = createApp()
    const port = config.get<number>('server.port') ?? 3000

    // Start the server
    app.listen(port, () => {
      const bootTime = momentUTC.diff(startTime, 'milliseconds')

      logger.info(`Server started on port ${port} in ${bootTime}ms`)
      logger.info(`Environment: ${process.env.NODE_ENV ?? 'development'}`)
      logger.info(
        `Documentation available at http://localhost:${port}/api/v1/docs`,
      )
    })

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Promise Rejection:', reason)
      // Don't exit the process, just log the error
    })

    // Handle uncaught exceptions
    process.on('uncaughtException', async (error: Error) => {
      logger.error('Uncaught Exception:', error)

      // Check if we have an open Prisma connection and close it
      if (isPrismaConnected()) {
        try {
          await disconnectPrisma()
          logger.info(
            'Successfully closed database connection after uncaught exception',
          )
        } catch (dbError) {
          logger.error(
            'Failed to close database connection after uncaught exception:',
            dbError,
          )
        }
      }

      // Exit the process with error
      process.exit(1)
    })

    // Handle graceful shutdown
    const gracefulShutdown = async (signal: string): Promise<void> => {
      const shutdownStart = momentUTC.now()
      logger.info(`${signal} received. Gracefully shutting down...`)

      try {
        // Disconnect from the database
        if (isPrismaConnected()) {
          await disconnectPrisma()
        }

        const shutdownTime = momentUTC.diff(shutdownStart, 'milliseconds')
        logger.info(`Graceful shutdown completed in ${shutdownTime}ms`)

        // Exit the process
        process.exit(0)
      } catch (error) {
        logger.error('Error during shutdown:', error)
        process.exit(1)
      }
    }

    // Listen for termination signals
    process.on('SIGINT', async () => {
      await gracefulShutdown('SIGINT')
    })
    process.on('SIGTERM', async () => {
      await gracefulShutdown('SIGTERM')
    })
  } catch (error) {
    logger.error('Failed to start server:', error)

    // Check if we have an open Prisma connection and close it
    if (isPrismaConnected()) {
      try {
        await disconnectPrisma()
        logger.info(
          'Successfully closed database connection after startup failure',
        )
      } catch (dbError) {
        logger.error(
          'Failed to close database connection after startup failure:',
          dbError,
        )
      }
    }

    process.exit(1)
  }
}

// Start the server
startServer()
