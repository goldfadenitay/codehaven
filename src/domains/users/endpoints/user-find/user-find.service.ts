import { type UserDto } from '@/domains/users/types'
import { NotFoundError } from '@/common/errors/ErrorTypes'
import { prismaClient } from '@/common/db/prisma'
import { isDefined } from '@/common/utils/isDefined'

/**
 * Service function for finding a user by ID
 */
export const userFindService = async (id: string): Promise<UserDto> => {
  const user = await prismaClient.user.findUnique({
    where: { id },
  })

  if (!isDefined(user)) {
    throw new NotFoundError(`User with ID ${id} not found`, 'USER_NOT_FOUND')
  }

  // Map to DTO (remove sensitive fields)
  const { password, refreshToken, tokenExpiry, lastLoginAt, ...userDto } = user

  return userDto
}
