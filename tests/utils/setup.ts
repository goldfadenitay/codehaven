import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { prismaClient } from '@common/db/prisma.js'

// Mock logger to reduce test noise
vi.mock('@common/utils/logger', () => ({
  logger: {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    setTraceId: vi.fn(),
    getTraceId: vi.fn(),
  },
}))

// Setup before all tests
beforeAll(async () => {
  // Connect to the test database
  await prismaClient.$connect()

  // Set test environment
  process.env.NODE_ENV = 'test'
})

// Cleanup after each test
afterEach(async () => {
  // Reset mocks
  vi.clearAllMocks()

  // Clean up database
  // Only delete data, don't recreate the database
  const tables = await prismaClient.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`

  // Disable foreign key checks temporarily
  await prismaClient.$executeRaw`SET session_replication_role = 'replica';`

  for (const { tablename } of tables) {
    if (tablename !== '_prisma_migrations') {
      await prismaClient.$executeRaw`TRUNCATE TABLE "public"."${tablename}" CASCADE;`
    }
  }

  // Re-enable foreign key checks
  await prismaClient.$executeRaw`SET session_replication_role = 'origin';`
})

// Cleanup after all tests
afterAll(async () => {
  // Disconnect from the database
  await prismaClient.$disconnect()
})
