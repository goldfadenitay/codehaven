import { type Request, type Response } from 'express'
import { asyncHandler } from '@/common/errors/ErrorHandler'
import { sendSuccess } from '@/common/utils/response'
import { userFindService } from './user-find.service'

/**
 * Controller for finding a single user by ID
 */
export const userFindController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await userFindService(id)
    return sendSuccess(res, user)
  },
)
