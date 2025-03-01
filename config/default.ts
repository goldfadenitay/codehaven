export default {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },

  // Database configuration
  database: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://postgres:postgres@127.0.0.1/codehaven?statusColor=686B6F&env=local&name=CodeHaven&tLSMode=0&usePrivateKey=false&safeModeLevel=0&advancedSafeModeLevel=0&driverVersion=0&lazyload=true',
  },

  // Logger configuration
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    morganFormat: 'combined',
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Trace-ID'],
    exposedHeaders: ['X-Trace-ID'],
    credentials: true,
  },

  // Authentication configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
  },

  // API documentation configuration
  documentation: {
    enabled: true,
    path: '/api/v1/docs',
  },

  // Monitoring configuration
  monitoring: {
    enabled: true,
  },
}
