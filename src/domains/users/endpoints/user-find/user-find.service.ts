import { type UserDto } from '../../types/index.js'
import { NotFoundError } from '@common/errors/ErrorTypes.js'
import { prismaClient } from '@common/db/prisma.js'
import { isDefined } from '@/utils/isDefined.js'

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
