import { prismaClient as prisma } from '@/common/db/prisma'
import { CreateUserRequest } from '@/domains/users/endpoints/user-create/user-create.controller'
import { AppError } from '@/common/errors/AppError'
import { User } from '@prisma/client'

export const createUser = async (data: CreateUserRequest): Promise<User> => {
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

    // Create the user
    return await prisma.user.create({
      data,
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
