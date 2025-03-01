import { UserRole } from '@prisma/client'

/**
 * Data Transfer Object (DTO) for User
 */
export interface UserDto {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Input for creating a new user
 */
export interface CreateUserInput {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
}

/**
 * Filters for querying users
 */
export interface UserFilters {
  search?: string
  role?: UserRole
  isActive?: boolean
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
