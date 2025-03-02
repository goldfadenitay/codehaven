import { HttpRequest, Controller } from '@/common/types/http'
import { validate } from '@/common/utils/validation'
import { z } from 'zod'
import { UserRole } from '@prisma/client'
import { created } from '@/common/utils/response'
import { userCreateService } from '@/domains/users/endpoints/user-create/user-create.service'
import { userCreateSerializer } from '@/domains/users/endpoints/user-create/user-create.serializer'

const createUserSchema = z.object({
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

export type CreateUserRequest = z.infer<typeof createUserSchema>

export const userCreateController: Controller = async (req: HttpRequest) => {
  const validatedData = validate(createUserSchema, req.body)
  const user = await userCreateService(validatedData)

  return created({
    message: 'User created successfully',
    data: { user: userCreateSerializer(user) },
  })
}
