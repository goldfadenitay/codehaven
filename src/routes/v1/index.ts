import { Router } from 'express'
import userRouter from '@domains/users/routes'

const router = Router()

// Register domain routers
router.use('/users', userRouter)

// Root route for API documentation
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'CodeHaven API v1',
    docs: '/api/v1/docs',
    endpoints: [
      {
        path: '/users',
        methods: ['GET', 'POST'],
        description: 'User management endpoints',
      },
      // Add other endpoints as they are implemented
    ],
  })
})

export default router
