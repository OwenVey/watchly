import { strictEqual } from 'node:assert';
import { test } from 'node:test';
import * as v from 'valibot';
import { MovieSearchSchema, SeriesSearchSchema } from '../src/schemas.ts';

void test('normalizes legacy timestamp search parameters to calendar dates', () => {
  const movieSearch = v.parse(MovieSearchSchema, { releasedAfter: '2026-08-09T05:00:00.000Z' });
  const seriesSearch = v.parse(SeriesSearchSchema, { firstAirDateBefore: '2026-08-10T05:00:00.000Z' });

  strictEqual(movieSearch.releasedAfter, '2026-08-09');
  strictEqual(seriesSearch.firstAirDateBefore, '2026-08-10');
});
