import * as v from 'valibot';

export const MovieReleaseTypeSchema = v.union([
  v.literal(1),
  v.literal(2),
  v.literal(3),
  v.literal(4),
  v.literal(5),
  v.literal(6),
]);

export const TvShowTypeSchema = v.union([
  v.literal(0),
  v.literal(1),
  v.literal(2),
  v.literal(3),
  v.literal(4),
  v.literal(5),
  v.literal(6),
]);

export const TvShowStatusSchema = v.union([
  v.literal(0),
  v.literal(1),
  v.literal(2),
  v.literal(3),
  v.literal(4),
  v.literal(5),
]);

export const OptionsSchema = v.array(v.object({ value: v.string(), label: v.string() }));

export const TrendingMediaTypeSchema = v.union([
  v.literal('all'),
  v.literal('movies'),
  v.literal('tv'),
  v.literal('people'),
]);
