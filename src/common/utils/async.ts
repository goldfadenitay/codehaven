import { logger } from './logger.js'

/**
 * Wraps an async function with a try/catch and returns a tuple containing
 * the result and error. Only one of these will be defined.
 * This is a safer alternative to throwing/catching exceptions for control flow.
 */
export const tryCatch = async <T>(
  fn: () => Promise<T>,
): Promise<[T | null, Error | null]> => {
  try {
    const result = await fn()
    return [result, null]
  } catch (error) {
    if (error instanceof Error) {
      return [null, error]
    }
    // If it's not an Error instance, create a new Error
    return [null, new Error(String(error))]
  }
}

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
