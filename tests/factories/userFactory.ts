import { type PrismaClient, type User, UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'

/**
 * Test factory for creating test data
 */
export class UserFactory {
  private readonly prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  /**
   * Create a test user
   */
  public async createUser(overrides: Partial<User> = {}): Promise<User> {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash('Password123!', salt)

    return await this.prisma.user.create({
      data: {
        email: `user-${Date.now()}@example.com`,
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER,
        isActive: true,
        ...overrides,
      },
    })
  }

  /**
   * Create multiple test users
   */
  public async createUsers(
    count: number,
    overrides: Partial<User> = {},
  ): Promise<User[]> {
    const users: User[] = []

    for (let i = 0; i < count; i++) {
      const user = await this.createUser({
        ...overrides,
        email: `user-${Date.now()}-${i}@example.com`,
      })
      users.push(user)
    }

    return users
  }

  // Add more factory methods for other entities as needed
}
