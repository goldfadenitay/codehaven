import { afterEach, beforeAll, vi } from 'vitest'
import { prisma } from '../../src/common/db/prisma'

// Mock logger to reduce test noise
vi.mock('../../src/common/utils/logger', () => ({
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

// Global setup before tests
beforeAll(async () => {
  // Connect to the database already happens via prisma client initialization
})

// Cleanup after each test
afterEach(async () => {
  // Reset mocks
  vi.clearAllMocks()

  // Clean up database - using a simpler approach
  // This avoids the information_schema query which may be causing issues
  const modelNames = Object.keys(prisma).filter(
    (key) => !key.startsWith('_') && !key.startsWith('$'),
  )

  // Delete data from all tables
  for (const modelName of modelNames) {
    if (typeof prisma[modelName].deleteMany === 'function') {
      await prisma[modelName].deleteMany({})
    }
  }
})
