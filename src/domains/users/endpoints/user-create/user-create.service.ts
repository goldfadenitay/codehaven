import { prisma } from '@/common/db/prisma'
import { CreateUserRequest } from '@/domains/users/endpoints/user-create/user-create.controller'
import { AppError } from '@/common/errors/appError'
import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
export const userCreateService = async (
  data: CreateUserRequest,
): Promise<Omit<User, 'password'>> => {
  try {
    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw AppError.conflict(
        'User with this email already exists',
        'USER_EMAIL_EXISTS',
      )
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    // Create the user
    return await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        refreshToken: true,
        tokenExpiry: true,
        createdAt: true,
        updatedAt: true,
        password: false,
      },
    })
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }

    throw AppError.internal(
      'Failed to create user',
      'USER_CREATE_FAILED',
      error as Record<string, unknown>,
    )
  }
}
