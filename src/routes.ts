import { Router } from 'express'
import userRouter from '@/domains/users/routes'
// Import other domain routers here

const router = Router()

// Register domain routers
router.use('/users', userRouter)
// Register other domain routers here

export default router
