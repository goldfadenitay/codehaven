import { PrismaClient } from '@prisma/client'
import { logger } from '../../src/common/utils/logger'
import { isDefined } from '../../src/common/utils/isDefined'

/**
 * Test database utility for managing the test database
 */
export class TestDatabase {
  private static instance: TestDatabase
  private readonly prisma: PrismaClient

  private constructor() {
    // Use a dedicated client for tests
    this.prisma = new PrismaClient({
      log: ['error'],
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL,
        },
      },
    })
  }

  /**
   * Get the singleton instance of the test database
   */
  public static getInstance(): TestDatabase {
    if (!isDefined(TestDatabase.instance)) {
      TestDatabase.instance = new TestDatabase()
    }
    return TestDatabase.instance
  }

  /**
   * Get the Prisma client
   */
  public getClient(): PrismaClient {
    return this.prisma
  }

  /**
   * Connect to the database
   */
  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect()
      logger.info('Connected to test database')
    } catch (error) {
      logger.error('Failed to connect to test database:', error)
      throw error
    }
  }

  /**
   * Disconnect from the database
   */
  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect()
      logger.info('Disconnected from test database')
    } catch (error) {
      logger.error('Failed to disconnect from test database:', error)
      throw error
    }
  }

  /**
   * Clean up all tables in the database
   */
  public async cleanup(): Promise<void> {
    try {
      // Delete data from all tables in the correct order to avoid foreign key constraints
      await this.prisma.product.deleteMany()
      await this.prisma.user.deleteMany()
      // Add more tables as needed

      logger.info('Test database cleaned up')
    } catch (error) {
      logger.error('Failed to clean up test database:', error)
      throw error
    }
  }
}
