import { type Prisma, PrismaClient } from '@prisma/client'
import { logger } from '@common/utils/logger'

// Singleton class for Prisma client
class PrismaClientSingleton {
  private static instance: PrismaClientSingleton
  private readonly prismaClient: PrismaClient
  private isConnected: boolean = false

  private constructor() {
    this.prismaClient = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    })

    this.prismaClient.$on('query', (e: Prisma.QueryEvent) => {
      logger.debug(`Query: ${e.query}`)
    })

    this.prismaClient.$on('error', (e: Prisma.LogEvent) => {
      logger.error(`Prisma Error: ${e.message}`, { target: e.target })
    })

    this.prismaClient.$on('info', (e: Prisma.LogEvent) => {
      logger.info(`Prisma Info: ${e.message}`)
    })

    this.prismaClient.$on('warn', (e: Prisma.LogEvent) => {
      logger.warn(`Prisma Warning: ${e.message}`)
    })
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
        await this.prismaClient.$connect()
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
        await this.prismaClient.$disconnect()
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
