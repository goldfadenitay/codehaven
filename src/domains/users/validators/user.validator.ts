import { z } from 'zod'
import { UserRole } from '@prisma/client'

/**
 * Schema for validating user creation input
 */
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must include uppercase, lowercase, number and special character',
    ),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.nativeEnum(UserRole, {
    errorMap: () => ({ message: 'Invalid user role' }),
  }),
})

/**
 * Schema for validating user ID in URL parameters
 */
export const userParamsSchema = z.object({
  id: z.string().uuid('Invalid user ID format'),
})

/**
 * Schema for validating user query filters
 */
export const userFiltersSchema = z.object({
  search: z.string().optional(),
  role: z
    .nativeEnum(UserRole, {
      errorMap: () => ({ message: 'Invalid user role' }),
    })
    .optional(),
  isActive: z
    .string()
    .optional()
    .transform((val) =>
      val === 'true' ? true : val === 'false' ? false : undefined,
    ),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 1)),
  pageSize: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 10)),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
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
