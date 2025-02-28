import { type Request, type Response } from 'express'
import { asyncHandler } from '@common/errors/ErrorHandler.js'
import { sendCreated } from '@common/utils/response.js'
import { type CreateUserInput } from '../../types/index.js'
import { userCreateService } from './user-create.service.js'

/**
 * Controller for user creation endpoint
 */
export const userCreateController = asyncHandler(
  async (req: Request, res: Response) => {
    // The request body is already validated by the validation middleware
    const validatedData = req.body as CreateUserInput

    // Call service
    const user = await userCreateService(validatedData)

    // Return response
    return sendCreated(res, user)
  },
)
