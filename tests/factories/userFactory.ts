import { type User, UserRole } from '@prisma/client'
import { prisma } from '@/common/db/prisma'
import { faker } from '@faker-js/faker'

/**
 * Test factory for creating test data
 */
export class UserFactory {
  private readonly prisma: typeof prisma

  constructor(prisma: typeof prisma) {
    this.prisma = prisma
  }

  /**
   * Create a test user
   */
  public async createUser(overrides: Partial<User> = {}): Promise<User> {
    return await this.prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        role: faker.helpers.arrayElement([UserRole.USER, UserRole.ADMIN]),
        isActive: faker.datatype.boolean(),
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
        email: faker.internet.email(),
      })
      users.push(user)
    }

    return users
  }

  // Add more factory methods for other entities as needed
}
