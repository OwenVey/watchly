import { strictEqual } from 'node:assert';
import { test } from 'node:test';
import {
  calendarDateToDate,
  compareIsoDates,
  dateToCalendarDate,
  differenceInCalendarYears,
  formatCalendarDate,
  formatCalendarYear,
  formatNumericCalendarDate,
} from '../src/lib/date.ts';

void test('formats the calendar portion of an ISO timestamp', () => {
  const timestamp = '1992-11-12T00:00:00.000Z';

  strictEqual(formatCalendarDate(timestamp), 'Nov 12, 1992');
  strictEqual(formatNumericCalendarDate(timestamp), '11/12/1992');
  strictEqual(formatCalendarYear(timestamp), '1992');
});

void test('round-trips calendar dates through the date-picker boundary', () => {
  const calendarDate = '2026-08-09';

  strictEqual(dateToCalendarDate(calendarDateToDate(calendarDate)), calendarDate);
});

void test('calculates completed calendar years', () => {
  const birthday = '2000-08-10';

  strictEqual(differenceInCalendarYears(birthday, '2026-08-09'), 25);
  strictEqual(differenceInCalendarYears(birthday, '2026-08-10'), 26);
});

void test('orders ISO timestamps chronologically', () => {
  strictEqual(compareIsoDates('2026-08-09T12:00:00Z', '2026-08-09T13:00:00Z'), -1);
  strictEqual(compareIsoDates('2026-08-09', '2026-08-09'), 0);
});
