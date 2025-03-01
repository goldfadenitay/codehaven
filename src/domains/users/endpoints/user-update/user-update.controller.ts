import { HttpRequest, Controller } from '@/common/types/http'
import { validate } from '@/common/utils/validation'
import { success } from '@/common/utils/response'
import { z } from 'zod'
import { UserRole } from '@prisma/client'
import { updateUser } from '@/domains/users/endpoints/user-update/user-update.service'

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

export type UpdateUserRequest = z.infer<typeof updateUserSchema>

export const userUpdateController: Controller = async (req: HttpRequest) => {
  const { id } = req.params
  const validatedData = validate(updateUserSchema, req.body)
  const user = await updateUser(id, validatedData)

  return success({
    message: 'User updated successfully',
    data: { user },
  })
}
