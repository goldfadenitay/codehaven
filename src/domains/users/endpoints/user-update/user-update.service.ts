import { User } from '@prisma/client'
import { prismaClient as prisma } from '@/common/db/prisma'
import { AppError } from '@/common/errors/appError'
import { getUserById } from '@/domains/users/endpoints/user-find/user-find.service'
import { UpdateUserRequest } from '@/domains/users/endpoints/user-update/user-update.controller'

export const updateUser = async (
  id: string,
  data: UpdateUserRequest,
): Promise<User> => {
  try {
    // Verify user exists
    await getUserById(id)

    // Update the user
    return await prisma.user.update({
      where: { id },
      data,
    })
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw AppError.internal(
      'Failed to update user',
      'USER_UPDATE_FAILED',
      error as Record<string, unknown>,
    )
  }
}
