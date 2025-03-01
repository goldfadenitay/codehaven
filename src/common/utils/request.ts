import { isDefined } from '@common/utils/isDefined'
import { type Request } from 'express'

/**
 * Parse user agent information from request
 */
export const getUserAgent = (req: Request): string | undefined => {
  return req.headers['user-agent']
}

/**
 * Get client IP address from request
 */
export const getClientIp = (req: Request): string => {
  const xForwardedFor = req.headers['x-forwarded-for']
  if (isDefined(xForwardedFor)) {
    // Extract first IP if there are multiple IPs in X-Forwarded-For
    if (typeof xForwardedFor === 'string') {
      return xForwardedFor.split(',')[0]?.trim() ?? ''
    }
    return xForwardedFor[0]?.split(',')[0]?.trim() ?? ''
  }
  return req.ip ?? req.socket.remoteAddress ?? ''
}

/**
 * Safely get a query parameter from request
 */
export const getQueryParam = <T = string>(
  req: Request,
  key: string,
  defaultValue: T,
): T => {
  const value = req.query[key]
  return value !== undefined ? (value as unknown as T) : defaultValue
}

/**
 * Get base URL from request
 */
export const getBaseUrl = (req: Request): string => {
  return `${req.protocol}://${req.headers.host}`
}

/**
 * Get full URL from request
 */
export const getFullUrl = (req: Request): string => {
  return `${getBaseUrl(req)}${req.originalUrl}`
}

/**
 * Get API version from request
 */
export const getApiVersion = (req: Request): string | null => {
  // Extract version from URL path
  // Expected format: /api/v1/...
  const matches = req.path.match(/^\/api\/v(\d+)/)
  return matches?.[1] ?? null
}
