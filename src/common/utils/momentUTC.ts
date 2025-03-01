import moment from 'moment'
import { isDefined } from '@/common/utils/isDefined'
/**
 * UTC moment module to ensure consistent timezone handling
 * This should be used throughout the application instead of importing moment directly.
 */
const momentUTC = {
  /**
   * Get current UTC time
   */
  utc: moment.utc,

  /**
   * Parse a date or time string and return a UTC moment object
   */
  parse: (date?: string | Date | number): moment.Moment => {
    return isDefined(date) ? moment.utc(date) : moment.utc()
  },

  /**
   * Current UTC timestamp
   */
  now: (): moment.Moment => {
    return moment.utc()
  },

  /**
   * Format a date using the specified format string
   * Default format is ISO8601 (compatible with JavaScript Date)
   */
  format: (date?: string | Date | number, format: string = ''): string => {
    const momentDate = isDefined(date) ? moment.utc(date) : moment.utc()
    return isDefined(format)
      ? momentDate.format(format)
      : momentDate.toISOString()
  },

  /**
   * Convert a duration in milliseconds to a human-readable string
   */
  formatDuration: (milliseconds: number): string => {
    return moment.duration(milliseconds).humanize()
  },

  /**
   * Compare two dates and get the difference in the specified unit
   */
  diff: (
    date1: string | Date | number | moment.Moment,
    date2: string | Date | number | moment.Moment,
    unit: moment.unitOfTime.Diff = 'milliseconds',
  ): number => {
    return moment.utc(date1).diff(moment.utc(date2), unit)
  },

  /**
   * Check if a date is before another date
   */
  isBefore: (
    date1: string | Date | number | moment.Moment,
    date2: string | Date | number | moment.Moment,
  ): boolean => {
    return moment.utc(date1).isBefore(moment.utc(date2))
  },

  /**
   * Check if a date is after another date
   */
  isAfter: (
    date1: string | Date | number | moment.Moment,
    date2: string | Date | number | moment.Moment,
  ): boolean => {
    return moment.utc(date1).isAfter(moment.utc(date2))
  },

  /**
   * Add a specified amount of time to a date
   */
  add: (
    date: string | Date | number | moment.Moment,
    amount: number,
    unit: moment.unitOfTime.DurationConstructor,
  ): moment.Moment => {
    return moment.utc(date).add(amount, unit)
  },

  /**
   * Subtract a specified amount of time from a date
   */
  subtract: (
    date: string | Date | number | moment.Moment,
    amount: number,
    unit: moment.unitOfTime.DurationConstructor,
  ): moment.Moment => {
    return moment.utc(date).subtract(amount, unit)
  },

  // /**
  //  * Convert a date to a specific time zone
  //  */
  // toTimezone: (
  //   date: string | Date | number | moment.Moment,
  //   timezone: string,
  // ): moment.Moment => {
  //   return moment.utc(date).tz(timezone)
  // },

  /**
   * Duration objects
   */
  duration: moment.duration,

  /**
   * Moment constants and helpers
   */
  unix: moment.unix,
  invalid: moment.invalid,
  isMoment: moment.isMoment,

  /**
   * Date/time constants
   */
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
}

export { momentUTC }
