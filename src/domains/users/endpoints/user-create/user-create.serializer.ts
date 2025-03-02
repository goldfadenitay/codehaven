import { User } from '@prisma/client'

export const userCreateSerializer = (
  user: Omit<User, 'password'>,
): Pick<User, 'id' | 'email' | 'firstName' | 'lastName'> => {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  }
}
