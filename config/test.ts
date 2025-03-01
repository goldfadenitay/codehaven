export default {
  // Server configuration
  server: {
    port: 3001,
  },

  // Database configuration
  database: {
    url:
      process.env.TEST_DATABASE_URL ||
      'postgresql://postgres:postgres@localhost:5432/codehaven_test?schema=public',
  },

  // Logger configuration
  logger: {
    level: 'error', // Minimal logging during tests
    morganFormat: 'dev',
  },

  // Authentication configuration - simpler for testing
  auth: {
    jwtSecret: 'test-secret-key',
    jwtExpiresIn: '1h',
    refreshTokenExpiresIn: '1d',
  },

  // Rate limiting - disabled for tests
  rateLimit: {
    enabled: false,
  },

  // API documentation configuration
  documentation: {
    enabled: false,
  },

  // Monitoring configuration
  monitoring: {
    enabled: false,
  },
}
