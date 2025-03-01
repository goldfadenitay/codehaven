import { Router } from 'express'
import { adaptExpressRoute } from '@/common/middleware/route-adapter'
import { userCreateController } from '@/domains/users/endpoints/user-create'
import { userFindController } from '@/domains/users/endpoints/user-find'
import { userUpdateController } from '@/domains/users/endpoints/user-update'

// Initialize the router
const userRouter = Router()

userRouter.post('/', adaptExpressRoute(userCreateController))
userRouter.get('/:id', adaptExpressRoute(userFindController))
userRouter.put('/:id', adaptExpressRoute(userUpdateController))

export default userRouter
