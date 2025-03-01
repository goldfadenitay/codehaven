import { describe, it, expect, vi, beforeEach } from 'vitest'
import { type NextFunction, type Request, type Response } from 'express'
import { userCreateController } from '../user-create.controller'
import * as userCreateServiceModule from '../user-create.service'
import { ConflictError } from '@/common/errors/ErrorTypes'
import { StatusCodes } from 'http-status-codes'
import { UserRole } from '@prisma/client'

const nextFunction = vi.fn() as unknown as NextFunction

// Mock the user-create service
vi.mock('../user-create.service', () => ({
  userCreateService: vi.fn(),
}))

// Mock response object
const mockResponse = (): Partial<Response> => ({
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis(),
})

describe('User Create Controller', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a user and return 201 status', async () => {
    // Mock request data
    const mockUserData = {
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
    }

    const req = {
      body: mockUserData,
    } as unknown as Request

    const res = mockResponse()

    // Mock service response
    const mockCreatedUser = {
      id: '1',
      email: mockUserData.email,
      firstName: mockUserData.firstName,
      lastName: mockUserData.lastName,
      role: mockUserData.role,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    vi.mocked(userCreateServiceModule.userCreateService).mockResolvedValue(
      mockCreatedUser,
    )

    // Call controller
    userCreateController(req, res as unknown as Response, nextFunction)

    // Check service was called with correct data
    expect(userCreateServiceModule.userCreateService).toHaveBeenCalledWith(
      mockUserData,
    )

    // Check response was sent correctly
    expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: mockCreatedUser,
      }),
    )
  })

  it('should handle conflict error when email already exists', async () => {
    // Mock request data
    const mockUserData = {
      email: 'existing@example.com',
      password: 'Password123!',
      firstName: 'Existing',
      lastName: 'User',
      role: UserRole.USER,
    }

    const req = {
      body: mockUserData,
    } as unknown as Request

    const res = mockResponse()
    const next = vi.fn()

    // Mock service to throw conflict error
    vi.mocked(userCreateServiceModule.userCreateService).mockRejectedValue(
      new ConflictError('Email already in use', 'EMAIL_IN_USE'),
    )

    // Call controller
    userCreateController(req, res as unknown as Response, nextFunction)

    // Check error was passed to next middleware
    expect(next).toHaveBeenCalledWith(expect.any(ConflictError))
  })
})
