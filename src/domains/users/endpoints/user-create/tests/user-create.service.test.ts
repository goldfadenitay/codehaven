import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userCreateService } from '../user-create.service.js'
import { prismaClient } from '@common/db/prisma.js'
import { ConflictError } from '@common/errors/ErrorTypes.js'
import { UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'

// Mock prismaClient
vi.mock('@common/db/prisma', () => ({
  prismaClient: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}))

// Mock bcrypt
vi.mock('bcrypt', () => ({
  genSalt: vi.fn().mockResolvedValue('salt'),
  hash: vi.fn().mockResolvedValue('hashed_password'),
}))

describe('User Create Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a user successfully', async () => {
    // Mock input data
    const mockUserData = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
    }

    // Mock prisma responses
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue(null)
    vi.mocked(prismaClient.user.create).mockResolvedValue({
      id: '1',
      email: mockUserData.email,
      password: 'hashed_password',
      firstName: mockUserData.firstName,
      lastName: mockUserData.lastName,
      role: mockUserData.role,
      isActive: true,
      refreshToken: null,
      tokenExpiry: null,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Call service
    const result = await userCreateService(mockUserData)

    // Check findUnique was called to check existing email
    expect(prismaClient.user.findUnique).toHaveBeenCalledWith({
      where: { email: mockUserData.email },
    })

    // Check password was hashed
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10)
    expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 'salt')

    // Check create was called with correct data
    expect(prismaClient.user.create).toHaveBeenCalledWith({
      data: {
        ...mockUserData,
        password: 'hashed_password',
      },
    })

    // Check result doesn't contain sensitive data
    expect(result).toEqual(
      expect.objectContaining({
        id: '1',
        email: mockUserData.email,
        firstName: mockUserData.firstName,
        lastName: mockUserData.lastName,
        role: mockUserData.role,
      }),
    )
    expect(result.password).toBeUndefined()
    expect(result.refreshToken).toBeUndefined()
    expect(result.tokenExpiry).toBeUndefined()
    expect(result.lastLoginAt).toBeUndefined()
  })

  it('should throw ConflictError when email already exists', async () => {
    // Mock input data
    const mockUserData = {
      email: 'existing@example.com',
      password: 'Password123!',
      firstName: 'Existing',
      lastName: 'User',
      role: UserRole.USER,
    }

    // Mock prisma response for existing user
    vi.mocked(prismaClient.user.findUnique).mockResolvedValue({
      id: '1',
      email: mockUserData.email,
      password: 'existing_password',
      firstName: 'Existing',
      lastName: 'User',
      role: UserRole.USER,
      isActive: true,
      refreshToken: null,
      tokenExpiry: null,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Check that service throws ConflictError
    await expect(userCreateService(mockUserData)).rejects.toThrow(ConflictError)

    // Create should not be called
    expect(prismaClient.user.create).not.toHaveBeenCalled()
  })
})
