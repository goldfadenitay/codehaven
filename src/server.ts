import { app } from '@/app'
import { logger } from '@/common/utils/logger'
import config from 'config'
import { momentUTC } from '@/common/utils/momentUTC'
import { prisma } from './common/db/prisma'

// Get port from configuration
const PORT = config.get<number>('server.port') ?? 3000

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`)
  logger.info(`Environment: ${process.env.NODE_ENV ?? 'development'}`)
  logger.info(`Documentation available at http://localhost:${PORT}/api/v1/docs`)
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Rejection:', reason)
  // Close server & exit process
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  logger.error('Uncaught Exception:', error)

  try {
    await prisma.$disconnect()
  } catch (dbError) {
    logger.error(
      'Try to close database connection after uncaught exception:',
      dbError,
    )
  }

  // Exit the process with error
  process.exit(1)
})

// Handle graceful shutdown
const gracefulShutdown = async (signal: string): Promise<void> => {
  const shutdownStart = momentUTC.now()
  logger.info(`${signal} received. Gracefully shutting down...`)

  try {
    await prisma.$disconnect()

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
