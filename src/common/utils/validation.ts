/**
 * Safely checks if a value is null or undefined
 */
export const isNullOrUndefined = <T>(
  value: T | null | undefined,
): value is null | undefined => {
  return value === null || value === undefined
}

/**
 * Safely gets a value, returning a default if the value is null or undefined
 */
export const safeGet = <T, D>(
  value: T | null | undefined,
  defaultValue: D,
): T | D => {
  return isNullOrUndefined(value) ? defaultValue : value
}

/**
 * Safely applies a transformation function to a value
 * Returns the default value if the input value is null or undefined
 * Returns the default value if the transformation function throws an error
 */
export const safeTransform = <T, R, D>(
  value: T | null | undefined,
  transform: (value: T) => R,
  defaultValue: D,
): R | D => {
  if (isNullOrUndefined(value)) {
    return defaultValue
  }

  try {
    return transform(value)
  } catch (error) {
    return defaultValue
  }
}
