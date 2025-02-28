import { z } from 'zod'
import { UserRole } from '@prisma/client'

// Create user validation schema
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character',
    ),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: 'Invalid user role' }),
  }),
})

// Update user validation schema
export const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  role: z
    .nativeEnum(UserRole, {
      errorMap: () => ({ message: 'Invalid user role' }),
    })
    .optional(),
  isActive: z.boolean().optional(),
})

// User filters validation schema
export const userFiltersSchema = z.object({
  role: z
    .nativeEnum(UserRole, {
      errorMap: () => ({ message: 'Invalid user role' }),
    })
    .optional(),
  isActive: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().optional().default(10),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
})

// Params validation schema for user ID
export const userParamsSchema = z.object({
  id: z.string().uuid('Invalid user ID format. Must be a valid UUID'),
})
