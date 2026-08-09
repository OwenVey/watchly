import { compareAsc, differenceInYears, format, parseISO } from 'date-fns';

const CALENDAR_DATE_LENGTH = 10;
const CALENDAR_DATE_FORMAT = 'yyyy-MM-dd';
const DISPLAY_DATE_FORMAT = 'MMM d, yyyy';
const NUMERIC_DATE_FORMAT = 'MM/dd/yyyy';
const YEAR_FORMAT = 'yyyy';

const parseCalendarDate = (value: string): Date => parseISO(value.slice(0, CALENDAR_DATE_LENGTH));

export function formatCalendarDate(value: string): string {
  return format(parseCalendarDate(value), DISPLAY_DATE_FORMAT);
}

export function formatCalendarYear(value: string): string {
  return format(parseCalendarDate(value), YEAR_FORMAT);
}

export function formatNumericCalendarDate(value: string): string {
  return format(parseCalendarDate(value), NUMERIC_DATE_FORMAT);
}

export function calendarDateToDate(value: string): Date {
  return parseCalendarDate(value);
}

export function dateToCalendarDate(value: Date): string {
  return format(value, CALENDAR_DATE_FORMAT);
}

export function getTodayCalendarDate(): string {
  return dateToCalendarDate(new Date());
}

export function differenceInCalendarYears(start: string, end: string): number {
  return differenceInYears(parseCalendarDate(end), parseCalendarDate(start));
}

export function compareIsoDates(first: string, second: string): number {
  return compareAsc(parseISO(first), parseISO(second));
}
