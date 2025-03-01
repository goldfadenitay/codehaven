import { type CreateUserInput, type UserDto } from '@domains/users/types'
import { ConflictError } from '@common/errors/ErrorTypes'
import { logger } from '@common/utils/logger'
import { prismaClient } from '@common/db/prisma'
import bcrypt from 'bcrypt'
import { isDefined } from '@common/utils/isDefined'

/**
 * Service function for user creation
 */
export const userCreateService = async (
  data: CreateUserInput,
): Promise<UserDto> => {
  // Check if email already exists
  const existingUser = await prismaClient.user.findUnique({
    where: { email: data.email },
  })

  if (isDefined(existingUser)) {
    throw new ConflictError('Email already in use', 'EMAIL_IN_USE')
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(data.password, salt)

  // Create the user with hashed password
  const userToCreate = {
    ...data,
    password: hashedPassword,
  }

  logger.info(`Creating new user with email: ${data.email}`)

  // Create user in database
  const user = await prismaClient.user.create({
    data: userToCreate,
  })

  // Map to DTO (remove sensitive fields)
  const { password, refreshToken, tokenExpiry, lastLoginAt, ...userDto } = user

  return userDto
}
