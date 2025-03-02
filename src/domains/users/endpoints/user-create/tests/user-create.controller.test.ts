import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userCreateController } from '@/domains/users/endpoints/user-create/user-create.controller'
import * as userCreateService from '@/domains/users/endpoints/user-create/user-create.service'
import { ConflictError } from '@/common/errors/errorTypes'
import { StatusCodes } from 'http-status-codes'
import { UserRole } from '@prisma/client'
import { HttpRequest } from '@/common/types/http'
import { prisma } from '@/common/db/prisma'
import { UserFactory } from '../../../../../../tests/factories/userFactory'
import { faker } from '@faker-js/faker'
// Mock the user-create service

const userCreateServiceSpy = vi.spyOn(userCreateService, 'userCreateService')

describe('User Create Controller', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
  })

  it('should create a user and return 201 status', async () => {
    // Mock request data
    const mockUserData = {
      email: faker.internet.email(),
      password: faker.internet.password({
        prefix: `123-APpa+!?`,
        length: 10,
      }),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: faker.helpers.arrayElement([UserRole.USER, UserRole.ADMIN]),
    }

    // Create mock HttpRequest
    const mockRequest: HttpRequest = {
      body: mockUserData,
      query: {},
      params: {},
      headers: {},
    }
    // Call controller
    const response = await userCreateController(mockRequest)

    // Check service was called with correct data
    expect(userCreateServiceSpy).toHaveBeenCalledOnce()

    // Check response structure
    expect(response.statusCode).toBe(StatusCodes.CREATED)
    expect(response.body).toMatchObject({
      message: 'User created successfully',
      data: {
        user: expect.objectContaining({
          id: expect.any(String),
          email: mockUserData.email,
          firstName: mockUserData.firstName,
          lastName: mockUserData.lastName,
        }),
      },
    })
    expect(
      (response.body as unknown as { data: { user: { password: string } } })
        .data.user.password,
    ).toBeUndefined()
  })

  it('should handle conflict error when email already exists', async () => {
    // Mock request data
    const mockUserData = {
      email: faker.internet.email(),
      password: faker.internet.password({
        prefix: `123-APpa+!?`,
        length: 10,
      }),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: faker.helpers.arrayElement([UserRole.USER, UserRole.ADMIN]),
    }

    await new UserFactory(prisma).createUser({
      email: mockUserData.email,
    })

    // Create mock HttpRequest
    const mockRequest: HttpRequest = {
      body: mockUserData,
      query: {},
      params: {},
      headers: {},
    }

    // Call controller and expect it to throw the error
    await expect(userCreateController(mockRequest)).rejects.toThrow(
      new ConflictError(
        'User with this email already exists',
        'USER_EMAIL_EXISTS',
      ),
    )
  })
})
