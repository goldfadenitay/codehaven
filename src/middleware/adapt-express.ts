import { Request, Response, NextFunction } from 'express'
import { HttpRequest } from '@/common/utils/http'
import { Controller } from '@/common/utils/controller'
import { AppError } from '@/common/errors/AppError'

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

        res.status(httpResponse.statusCode).json(httpResponse.body)
      } catch (error) {
        // Convert unknown errors to AppError
        if (!(error instanceof AppError)) {
          next(
            AppError.internal('Internal Server Error', 'INTERNAL_ERROR', error),
          )
          return
        }
        next(error)
        return
      }
    })()
  }
