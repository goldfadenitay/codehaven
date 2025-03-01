import { z } from 'zod'
import { AppError } from '@/common/errors/AppError'

export const validate = <T>(schema: z.ZodType<T>, data: unknown): T => {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw AppError.badRequest('Validation Error', 'VALIDATION_ERROR', {
        errors: error.errors,
      })
    }
    throw error
  }
}

export const validateAsync = async <T>(
  schema: z.ZodType<T>,
  data: unknown,
): Promise<T> => {
  try {
    return await schema.parseAsync(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw AppError.badRequest('Validation Error', 'VALIDATION_ERROR', {
        errors: error.errors,
      })
    }
    throw error
  }
}
