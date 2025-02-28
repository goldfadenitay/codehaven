import { type UserRole } from '@prisma/client'

// User DTO types
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

// Create user input type
export interface CreateUserInput {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
}

// Update user input type
export interface UpdateUserInput {
  firstName?: string
  lastName?: string
  role?: UserRole
  isActive?: boolean
}

// Filter user query params
export interface UserFilters {
  role?: UserRole
  isActive?: boolean
  search?: string
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
