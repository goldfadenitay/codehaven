/** Wraps an async function with a try/catch and returns a tuple containing
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
