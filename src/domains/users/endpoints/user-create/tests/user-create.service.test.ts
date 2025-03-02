import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userCreateService } from '@/domains/users/endpoints/user-create/user-create.service'
import { prisma } from '@/common/db/prisma'
import { ConflictError } from '@/common/errors/errorTypes'
import { User, UserRole } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcrypt'
import { UserFactory } from '../../../../../../tests/factories/userFactory'

const bcryptMock = vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password')

describe('User Create Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a user successfully', async () => {
    const mockUserData = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: faker.helpers.arrayElement([UserRole.USER, UserRole.ADMIN]),
    }

    const result = await userCreateService(mockUserData)

    expect(result).toEqual(
      expect.objectContaining({
        email: mockUserData.email,
        firstName: mockUserData.firstName,
        lastName: mockUserData.lastName,
        role: mockUserData.role,
      }),
    )

    expect((result as User).password).toBeUndefined()

    const finalUser = await prisma.user.findMany({
      where: { email: mockUserData.email },
    })

    expect(finalUser).toHaveLength(1)
    expect(finalUser[0].email).toBe(mockUserData.email)

    expect(bcryptMock).toHaveBeenCalledWith(mockUserData.password, 10)
  })

  it('should throw ConflictError when email already exists', async () => {
    const mockUserData = {
      email: faker.internet.email(),
      password: faker.internet.password(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      role: faker.helpers.arrayElement([UserRole.USER, UserRole.ADMIN]),
    }

    await new UserFactory(prisma).createUser({
      email: mockUserData.email,
    })

    await expect(userCreateService(mockUserData)).rejects.toThrow(
      new ConflictError(
        'User with this email already exists',
        'USER_EMAIL_EXISTS',
      ),
    )
  })
})
