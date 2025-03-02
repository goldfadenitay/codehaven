import { describe, it, expect, vi } from 'vitest'
import { prisma } from '@/common/db/prisma'
import { StatusCodes } from 'http-status-codes'
import { UserRole } from '@prisma/client'
import { UserFactory } from '../../../../../../tests/factories/userFactory'
import { faker } from '@faker-js/faker'
import supertest from 'supertest'
import { app } from '@/app'

vi.mock('@/common/utils/logger', () => ({
  createRequestLogger: vi.fn().mockReturnValue({
    info: vi.fn(),
    error: vi.fn(),
    end: vi.fn(),
  }),
}))

describe('User Create Controller Integration Test', () => {
  it('should create a user and return 201 status', async () => {
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

    await supertest(app)
      .post('/api/v1/users')
      .send(mockUserData)
      .expect(StatusCodes.CREATED)

    const createdUsers = await prisma.user.findMany({
      where: {
        email: mockUserData.email,
      },
    })
    expect(createdUsers[0]).toEqual({
      id: expect.any(String),
      email: mockUserData.email,
      password: expect.any(String),
      firstName: mockUserData.firstName,
      lastName: mockUserData.lastName,
      role: mockUserData.role,
      isActive: true,
      lastLoginAt: null,
      refreshToken: null,
      tokenExpiry: null,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should create a user and return 201 status', async () => {
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

    const existingUser = await new UserFactory(prisma).createUser({
      email: mockUserData.email,
    })

    await supertest(app)
      .post('/api/v1/users')
      .send(mockUserData)
      .expect(StatusCodes.CONFLICT)

    const createdUsers = await prisma.user.findMany({
      where: {
        email: existingUser.email,
      },
    })

    expect(createdUsers).toHaveLength(1)
  })
})
