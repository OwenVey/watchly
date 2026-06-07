import * as v from 'valibot';

export const OptionsSchema = v.array(v.object({ value: v.string(), label: v.string() }));

export const TrendingMediaTypeSchema = v.union([
  v.literal('all'),
  v.literal('movies'),
  v.literal('tv'),
  v.literal('people'),
]);
