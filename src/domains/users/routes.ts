import { Router } from 'express'
import {
  validateBody,
  validateParams,
  validateQuery,
} from '@/middleware/validationMiddleware.js'
import {
  createUserSchema,
  userParamsSchema,
  userFiltersSchema,
} from './validators/user.validator.js'

// Import controllers from endpoints
import { userCreateController } from './endpoints/user-create/index.js'
import { userFindController } from './endpoints/user-find/index.js'
import { usersFindController } from './endpoints/users-find/index.js'
// Import other controllers as they are created

// Initialize the router
const userRouter = Router()

// Define routes with validation
userRouter.get('/', validateQuery(userFiltersSchema), usersFindController)
userRouter.get('/:id', validateParams(userParamsSchema), userFindController)
userRouter.post('/', validateBody(createUserSchema), userCreateController)
// Add other routes as they are implemented

export default userRouter
