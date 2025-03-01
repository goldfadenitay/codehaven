import { Router } from 'express'
import {
  validateBody,
  validateParams,
  validateQuery,
} from '@/middleware/validationMiddleware'
import {
  createUserSchema,
  userParamsSchema,
  userFiltersSchema,
} from '@/domains/users/validators/user.validator'

// Import controllers from endpoints
import { userCreateController } from '@/domains/users/endpoints/user-create/index'
import { userFindController } from '@/domains/users/endpoints/user-find/index'
import { usersFindController } from '@/domains/users/endpoints/users-find/index'
// Import other controllers as they are created

// Initialize the router
const userRouter = Router()

// Define routes with validation
userRouter.get('/', validateQuery(userFiltersSchema), usersFindController)
userRouter.get('/:id', validateParams(userParamsSchema), userFindController)
userRouter.post('/', validateBody(createUserSchema), userCreateController)
// Add other routes as they are implemented

export default userRouter
