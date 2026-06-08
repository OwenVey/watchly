import * as v from 'valibot';

const PositiveIntegerParamSchema = v.pipe(v.string(), v.regex(/^[1-9]\d*$/), v.transform(Number));

export const CollectionIdParamsSchema = v.object({ collectionId: PositiveIntegerParamSchema });
export const MovieIdParamsSchema = v.object({ movieId: PositiveIntegerParamSchema });
export const OptionsSchema = v.array(v.object({ value: v.string(), label: v.string() }));
export const PersonIdParamsSchema = v.object({ personId: PositiveIntegerParamSchema });
export const SeriesIdParamsSchema = v.object({ seriesId: PositiveIntegerParamSchema });

export const TrendingMediaTypeSchema = v.union([
  v.literal('all'),
  v.literal('movies'),
  v.literal('tv'),
  v.literal('people'),
]);
