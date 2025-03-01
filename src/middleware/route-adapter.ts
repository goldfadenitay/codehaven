import { Request, Response, NextFunction } from 'express'
import { Controller, HttpRequest } from '@/common/types/http'
import { AppError } from '@/common/errors/appError'
import { isPrismaConnected, prismaClient } from '@/common/db/prisma'
import { logger } from '@/common/utils/logger'

const disconnectPrisma = async (): Promise<void> => {
  if (isPrismaConnected()) {
    await prismaClient.$disconnect()
  }
}

export const adaptExpressRoute =
  (controller: Controller) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const httpRequest: HttpRequest = {
      body: req.body,
      query: req.query as Record<string, string>,
      params: req.params,
      headers: req.headers as Record<string, string>,
    }

    void (async (): Promise<void> => {
      try {
        const httpResponse = await controller(httpRequest)
        if (httpResponse?.headers) {
          Object.entries(httpResponse.headers).forEach(([key, value]) => {
            res.setHeader(key, value)
          })
        }
        await disconnectPrisma()
        res.status(httpResponse.statusCode).json(httpResponse.body)
      } catch (error) {
        // Convert unknown errors to AppError
        if (!(error instanceof AppError)) {
          next(
            AppError.internal('Internal Server Error', 'INTERNAL_ERROR', error),
          )
          return
        }
        //
        try {
          await disconnectPrisma()
        } catch (error) {
          logger.error('Error disconnecting from Prisma', error)
        }
        next(error)
        return
      }
    })()
  }
