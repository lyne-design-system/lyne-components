import {
  i18nDurationHour,
  i18nDurationMinute,
  i18nDurationDay,
} from '@sbb-esta/lyne-elements/core/i18n.js';
import {
  isValid,
  parseISO,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  addMinutes,
  subHours,
  subDays,
} from 'date-fns';

/**
 * This function removes the offset of a ISO date string. This needs to be done to make sure that the offset is ignored.
 * If it is not removed the time would be converted to the browsers local time.
 * Example: "2022-08-29T09:30:00+03:00" would be changed to "2022-08-29T08:30:00+02:00" --> not the desired outcome, as we want to use the time in the timezone and not the local time.
 *
 * After the offset is removed a new date is created in the browsers local time. This ensures that the time of the ISO date string is displayed and not a converted time.
 * Example: "2022-08-29T09:30:00+03:00" would be changed to "2022-08-29T09:30:00+02:00" --> desired outcome
 * Attention: This function does not convert the time to the correct time in the local timezone. It is a workaround to make sure, that the given time is displayed without being converted.
 *
 * Offset: Difference between the timezone and Coordinated Universal Time.
 *
 * @param isoTime - the iso time with the timezone offset
 * @returns a new date with the local timezone with the local offset
 */
export function removeTimezoneFromISOTimeString(isoTime?: string): Date | undefined {
  if (!isoTime) {
    return undefined;
  }
  const parsedDate = parseISO(isoTime);

  if (!isValid(parsedDate)) {
    return undefined;
  }

  if (isoTime.includes('Z')) {
    return new Date(isoTime.replace('Z', ''));
  }

  if (isoTime.includes('T')) {
    const dateTime = isoTime.split('T');

    if (dateTime[1] && (dateTime[1].includes('+') || dateTime[1].includes('-'))) {
      return new Date(`${dateTime[0]}T${dateTime[1].split(/[+-]/)[0]}`);
    }
  }
  return new Date(isoTime);
}

/**
 * This function converts a duration number to date string with specific format
 *
 * @param duration - duration in minutes
 * @param currentLanguage - currentLanguage
 * @returns an Object with two strings in the format "dd hh mm" (short) an "x Day(s) x Hour(s) x Minute(s) (long)"
 * */

export const durationToTime = (
  duration: number,
  currentLanguage?: string,
): { short: string; long: string } => {
  const short = [];
  const long = [];

  const now = 0;
  let future = addMinutes(now, duration);

  const days = differenceInDays(future, now);
  if (days > 0) {
    short.push(`${days} d`);
    currentLanguage &&
      long.push(
        `${days} ${
          days > 1
            ? i18nDurationDay.multiple.long[currentLanguage]
            : i18nDurationDay.single.long[currentLanguage]
        }`,
      );
    future = subDays(future, days);
  }

  const hours = differenceInHours(future, now);
  if (hours > 0) {
    short.push(`${hours} h`);
    currentLanguage &&
      long.push(
        `${hours} ${
          hours > 1
            ? i18nDurationHour.multiple.long[currentLanguage]
            : i18nDurationHour.single.long[currentLanguage]
        }`,
      );
    future = subHours(future, hours);
  }

  const minutes = differenceInMinutes(future, now);
  if (minutes > 0) {
    short.push(`${minutes} min`);
    currentLanguage &&
      long.push(
        `${minutes} ${
          minutes > 1
            ? i18nDurationMinute.multiple.long[currentLanguage]
            : i18nDurationMinute.single.long[currentLanguage]
        }`,
      );
  }

  return {
    short: short.join(' '),
    long: long.join(' '),
  };
};
