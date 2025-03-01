export default {
  // Logger configuration
  logger: {
    level: 'info',
    morganFormat: 'combined',
  },

  // CORS configuration - more restrictive in production
  cors: {
    origin: process.env.CORS_ORIGIN || 'https://yourdomain.com',
    credentials: true,
  },

  // Rate limiting configuration - more restrictive in production
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
  },

  // API documentation configuration - disabled in production
  documentation: {
    enabled: false,
  },

  // Monitoring configuration
  monitoring: {
    enabled: true,
    detailed: false,
  },
}
