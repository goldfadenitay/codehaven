import { Prisma, PrismaClient } from '@prisma/client'
import { logger } from '@/common/utils/logger'

// Create a Prisma Client extension for logging
const withLogging = Prisma.defineExtension({
  name: 'logging',
  query: {
    $allModels: {
      $allOperations: async ({ operation, model, args, query }) => {
        const start = performance.now()

        logger.debug(`Query started: ${model}.${operation}`, {
          model,
          operation,
          args,
        })

        try {
          const result = await query(args)
          const end = performance.now()
          const duration = end - start

          logger.debug(
            `Query completed: ${model}.${operation} in ${duration.toFixed(2)}ms`,
            {
              model,
              operation,
              duration,
            },
          )

          return result
        } catch (error) {
          const end = performance.now()
          const duration = end - start

          logger.error(
            `Query failed: ${model}.${operation} in ${duration.toFixed(2)}ms`,
            {
              model,
              operation,
              duration,
              error,
            },
          )

          throw error
        }
      },
    },
  },
})

// Define a type for the extended client
// type ExtendedPrismaClient = ReturnType<typeof extendPrismaClient>

// Function to create and extend the Prisma client
function extendPrismaClient(): PrismaClient {
  const client = new PrismaClient({
    log: [
      { level: 'query', emit: 'stdout' },
      { level: 'error', emit: 'stdout' },
      { level: 'info', emit: 'stdout' },
      { level: 'warn', emit: 'stdout' },
    ],
  })

  client.$extends(withLogging)

  return client
}

// Singleton class for Prisma client
class PrismaClientSingleton {
  private static instance: PrismaClientSingleton
  private readonly prismaClient: PrismaClient
  private readonly baseClient: PrismaClient
  private isConnected: boolean = false

  private constructor() {
    // Create the base client
    this.baseClient = new PrismaClient()

    // Create the extended client
    this.prismaClient = extendPrismaClient()
  }

  public static getInstance(): PrismaClientSingleton {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClientSingleton()
    }
    return PrismaClientSingleton.instance
  }

  public getClient(): PrismaClient {
    return this.prismaClient
  }

  public async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        // Use the base client for connection
        await this.baseClient.$connect()
        this.isConnected = true
        logger.info('Successfully connected to the database')
      } catch (error) {
        logger.error('Failed to connect to the database', { error })
        throw error
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        // Use the base client for disconnection
        await this.baseClient.$disconnect()
        this.isConnected = false
        logger.info('Successfully disconnected from the database')
      } catch (error) {
        logger.error('Failed to disconnect from the database', { error })
        throw error
      }
    }
  }

  public isClientConnected(): boolean {
    return this.isConnected
  }
}

// Export the singleton instance
export const prismaClient = PrismaClientSingleton.getInstance().getClient()

// Export connection management functions
export const connectPrisma = async (): Promise<void> => {
  await PrismaClientSingleton.getInstance().connect()
}

export const disconnectPrisma = async (): Promise<void> => {
  await PrismaClientSingleton.getInstance().disconnect()
}

export const isPrismaConnected = (): boolean => {
  return PrismaClientSingleton.getInstance().isClientConnected()
}
