import { type Request, type Response } from 'express'
import { asyncHandler } from '@/common/errors/ErrorHandler'
import { sendPaginatedSuccess } from '@/common/utils/response'
import { usersFindService } from './users-find.service'
import { type UserFilters } from '@/domains/users/types'

/**
 * Controller for finding users with filters
 */
export const usersFindController = asyncHandler(
  async (req: Request, res: Response) => {
    // Validate and parse query parameters
    const filters = req.query as UserFilters
    // Call service
    const { users, total } = await usersFindService(filters)

    // Return paginated response
    return sendPaginatedSuccess(
      res,
      users,
      total,
      filters.page ?? 1,
      filters.pageSize ?? 10,
    )
  },
)
