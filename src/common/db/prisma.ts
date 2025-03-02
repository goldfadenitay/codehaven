import { PrismaClient } from '@prisma/client'
import { logger } from '@/common/utils/logger'
import { momentUTC } from '../utils/momentUTC'

const QUERY_EXECUTION_DURATION_MAX_MS = 500

const prismaInit = new PrismaClient({
  log: [{ level: 'query', emit: 'event' }],
})

// Extend Prisma Client to log slow queries
const prisma = prismaInit.$extends({
  name: 'LogSlowQueries',
  query: {
    $allModels: {
      $allOperations: async ({ model, operation, args, query }) => {
        const startPrisma = momentUTC.now()
        const result = await query(args)
        const endPrisma = momentUTC.now()
        const duration = momentUTC.diff(startPrisma, endPrisma)

        if (duration > QUERY_EXECUTION_DURATION_MAX_MS) {
          logger.info(
            `Slow query: Model=${model}, Operation=${operation}, Duration=${duration}ms`,
          )
        }

        return result
      },
    },
  },
})

export { prisma }
