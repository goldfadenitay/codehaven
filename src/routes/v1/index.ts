import { Router } from 'express'
import userRouter from '@/domains/users/routes'

const v1Router = Router()

// Mount domain-specific routes
v1Router.use('/users', userRouter)

// Add more domain routes here as needed
// v1Router.use('/products', productRouter)
// v1Router.use('/orders', orderRouter)

// Root route for API documentation
v1Router.get('/', (_, res) => {
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

export default v1Router
