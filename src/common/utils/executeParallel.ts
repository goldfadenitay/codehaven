import { logger } from '@/common/utils/logger'
import { tryCatch } from '@/common/utils/tryCatch'

/**
 * Safely executes multiple promises in parallel and returns their results
 * If any promise fails, the error is logged but the function continues
 */
export const executeParallel = async <T>(
  tasks: Array<() => Promise<T>>,
  errorHandler?: (error: Error, index: number) => void,
): Promise<Array<T | null>> => {
  const results: Array<T | null> = []

  await Promise.all(
    tasks.map(async (task, index) => {
      const [result, error] = await tryCatch(task)

      if (error) {
        if (errorHandler) {
          errorHandler(error, index)
        } else {
          logger.error(
            `Error executing parallel task at index ${index}: ${error.message}`,
          )
        }
        results[index] = null
      } else {
        results[index] = result
      }
    }),
  )

  return results
}
