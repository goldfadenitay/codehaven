import { afterAll, beforeAll, vi } from 'vitest'
import { prismaClient } from '@/common/db/prisma'

// Setup before all tests
beforeAll(async () => {
  // Mock environment variables
  process.env.NODE_ENV = 'test'
  
  // Add trace ID to request objects for testing
  vi.mock('express', async () => {
    const actual = await vi.importActual('express')
    return {
      ...actual,
      Request: Object.defineProperty(
        {},
        'prototype',
        {
          value: {
            traceId: 'test-trace-id',
            startTime: Date.now(),
            requestMetadata: {
              method: 'GET',
              path: '/test',
              ip: '127.0.0.1',
              userAgent: 'test-agent',
              startTimestamp: new Date().toISOString(),
            },
          },
          writable: true,
        },
      ),
    }
  })
})

// Cleanup after all tests
afterAll(async () => {
  await prismaClient.$disconnect()
}) 