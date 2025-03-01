import { v4 as uuidv4 } from 'uuid'
import { Request, Response, NextFunction } from 'express'

// Extend Express Request type to include id
declare module 'express' {
  interface Request {
    requestId?: string
  }
}

const withRequestId = <T extends Request>(
  req: T,
): T & { requestId: string } => {
  const requestId = uuidv4()
  return Object.assign(req, { requestId })
}

export const addRequestId = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const reqWithId = withRequestId(req)
  res.setHeader('X-Request-ID', reqWithId.requestId)
  next()
}
