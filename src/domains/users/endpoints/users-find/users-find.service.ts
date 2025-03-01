import { type UserDto, type UserFilters } from '@domains/users/types'
import { prismaClient } from '@common/db/prisma'
import { type Prisma } from '@prisma/client'

/**
 * Service function for finding users with filters
 */
export const usersFindService = async (
  filters: UserFilters,
): Promise<{ users: UserDto[]; total: number }> => {
  const {
    role,
    isActive,
    search,
    page = 1,
    pageSize = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters

  // Build the where clause
  const where: Prisma.UserWhereInput = {}

  if (role !== undefined) {
    where.role = role
  }

  if (isActive !== undefined) {
    where.isActive = isActive
  }

  if (typeof search === 'string') {
    where.OR = [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  // Calculate pagination
  const skip = (page - 1) * pageSize

  // Build the orderBy
  const orderBy: Prisma.UserOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  }

  // Execute queries
  const [users, total] = await Promise.all([
    prismaClient.user.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
    }),
    prismaClient.user.count({ where }),
  ])

  // Map to DTOs (remove sensitive fields)
  const userDtos = users.map(
    ({ password, refreshToken, tokenExpiry, lastLoginAt, ...userDto }) =>
      userDto,
  )

  return {
    users: userDtos,
    total,
  }
}
