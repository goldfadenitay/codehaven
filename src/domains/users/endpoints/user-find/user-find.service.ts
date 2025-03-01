import { prismaClient as prisma } from '@/common/db/prisma'
import { AppError } from '@/common/errors/AppError'
import { User } from '@prisma/client'

export const getUserById = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    throw AppError.notFound('User not found', 'USER_NOT_FOUND')
  }

  return user
}
