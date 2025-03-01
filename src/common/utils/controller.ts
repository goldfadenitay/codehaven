import { ZodType } from 'zod'
import { HttpRequest, HttpResponse } from '@/common/utils/http'

export interface Controller {
  (req: HttpRequest): Promise<HttpResponse<unknown>>
  params?: Record<string, ZodType>
  query?: Record<string, ZodType>
  body?: Record<string, ZodType>
  responses?: Record<string, ZodType>
}

export type ControllerFn<T> = Controller &
  ((req: HttpRequest) => Promise<HttpResponse<T>>)
