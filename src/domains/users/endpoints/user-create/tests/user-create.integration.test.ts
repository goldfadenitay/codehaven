import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { createApp } from '../../../../../app'
import request from 'supertest'
import {
  prismaClient,
  connectPrisma,
  disconnectPrisma,
} from '@/common/db/prisma'
import { UserRole } from '@prisma/client'

describe('User Create Integration Test', () => {
  // Setup
  beforeAll(async () => {
    await connectPrisma()
  })

  // Cleanup after all tests
  afterAll(async () => {
    await disconnectPrisma()
  })

  // Clean database before each test
  beforeEach(async () => {
    await prismaClient.user.deleteMany()
  })

  // Create app instance
  const app = createApp()

  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
    }

    const response = await request(app)
      .post('/api/v1/users')
      .send(userData)
      .expect('Content-Type', /json/)
      .expect(201)

    expect(response.body.success).toBe(true)
    expect(response.body.data.email).toBe(userData.email)
    expect(response.body.data.firstName).toBe(userData.firstName)
    expect(response.body.data.lastName).toBe(userData.lastName)
    expect(response.body.data.role).toBe(userData.role)

    // Password should not be returned
    expect(response.body.data.password).toBeUndefined()

    // Verify user was created in database
    const createdUser = await prismaClient.user.findUnique({
      where: { email: userData.email },
    })

    expect(createdUser).not.toBeNull()
    expect(createdUser?.email).toBe(userData.email)
  })

  it('should return validation error for invalid data', async () => {
    const invalidUserData = {
      email: 'invalid-email',
      password: 'short',
      firstName: '',
      lastName: '',
      role: 'INVALID_ROLE',
    }

    const response = await request(app)
      .post('/api/v1/users')
      .send(invalidUserData)
      .expect('Content-Type', /json/)
      .expect(422)

    expect(response.body.success).toBe(false)
    expect(response.body.error.code).toBe('VALIDATION_ERROR')
  })

  it('should return conflict error when email already exists', async () => {
    // First create a user
    const userData = {
      email: 'existing@example.com',
      password: 'Password123!',
      firstName: 'Existing',
      lastName: 'User',
      role: UserRole.USER,
    }

    await request(app).post('/api/v1/users').send(userData).expect(201)

    // Try to create a user with the same email
    const response = await request(app)
      .post('/api/v1/users')
      .send(userData)
      .expect('Content-Type', /json/)
      .expect(409)

    expect(response.body.success).toBe(false)
    expect(response.body.error.code).toBe('EMAIL_IN_USE')
  })
})
