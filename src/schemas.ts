import { DiscoverTVType, MovieReleaseType } from '@lorenzopant/tmdb';
import * as v from 'valibot';
import { DEFAULT_CARD_VIEW, DEFAULT_MOVIE_SEARCH, DEFAULT_SERIES_SEARCH, LANGUAGES_MAP } from '@/lib/constants';
import { schemaObjectKeys } from '@/lib/utils';

const CALENDAR_DATE_LENGTH = 10;
const PositiveIntegerParamSchema = v.pipe(v.string(), v.regex(/^[1-9]\d*$/), v.transform(Number));
const CalendarDateParamSchema = v.pipe(
  v.union([v.pipe(v.string(), v.isoDate()), v.pipe(v.string(), v.isoTimestamp())]),
  v.transform((date) => date.slice(0, CALENDAR_DATE_LENGTH)),
);

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

export const MovieSearchSchema = v.object({
  releasedAfter: v.optional(CalendarDateParamSchema),
  releasedBefore: v.optional(CalendarDateParamSchema),
  ratingMin: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_MOVIE_SEARCH.ratingMax - 1)),
      DEFAULT_MOVIE_SEARCH.ratingMin,
    ),
    DEFAULT_MOVIE_SEARCH.ratingMin,
  ),
  ratingMax: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_MOVIE_SEARCH.ratingMax)),
      DEFAULT_MOVIE_SEARCH.ratingMax,
    ),
    DEFAULT_MOVIE_SEARCH.ratingMax,
  ),
  voteCountMin: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_MOVIE_SEARCH.voteCountMax - 1)),
      DEFAULT_MOVIE_SEARCH.voteCountMin,
    ),
    DEFAULT_MOVIE_SEARCH.voteCountMin,
  ),
  voteCountMax: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_MOVIE_SEARCH.voteCountMax)),
      DEFAULT_MOVIE_SEARCH.voteCountMax,
    ),
    DEFAULT_MOVIE_SEARCH.voteCountMax,
  ),
  runtimeMin: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_MOVIE_SEARCH.runtimeMax - 1)),
      DEFAULT_MOVIE_SEARCH.runtimeMin,
    ),
    DEFAULT_MOVIE_SEARCH.runtimeMin,
  ),
  runtimeMax: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_MOVIE_SEARCH.runtimeMax)),
      DEFAULT_MOVIE_SEARCH.runtimeMax,
    ),
    DEFAULT_MOVIE_SEARCH.runtimeMax,
  ),
  sort: v.optional(
    v.fallback(
      v.picklist(['vote_average', 'primary_release_date', 'revenue', 'popularity', 'title', 'vote_count']),
      DEFAULT_MOVIE_SEARCH.sort,
    ),
    DEFAULT_MOVIE_SEARCH.sort,
  ),
  sortDir: v.optional(
    v.fallback(v.picklist(['asc', 'desc']), DEFAULT_MOVIE_SEARCH.sortDir),
    DEFAULT_MOVIE_SEARCH.sortDir,
  ),
  genres: v.optional(v.fallback(v.array(v.number()), DEFAULT_MOVIE_SEARCH.genres), DEFAULT_MOVIE_SEARCH.genres),
  releaseTypes: v.optional(
    v.fallback(v.array(v.picklist(Object.values(MovieReleaseType))), DEFAULT_MOVIE_SEARCH.releaseTypes),
    DEFAULT_MOVIE_SEARCH.releaseTypes,
  ),
  keywords: v.optional(v.fallback(OptionsSchema, DEFAULT_MOVIE_SEARCH.keywords), DEFAULT_MOVIE_SEARCH.keywords),
  studios: v.optional(v.fallback(OptionsSchema, DEFAULT_MOVIE_SEARCH.studios), DEFAULT_MOVIE_SEARCH.studios),
  originalLanguage: v.optional(schemaObjectKeys(LANGUAGES_MAP)),
  watchProviders: v.optional(
    v.fallback(v.array(v.number()), DEFAULT_MOVIE_SEARCH.watchProviders),
    DEFAULT_MOVIE_SEARCH.watchProviders,
  ),
  adult: v.optional(v.fallback(v.boolean(), DEFAULT_MOVIE_SEARCH.adult), DEFAULT_MOVIE_SEARCH.adult),
  cardSize: v.optional(
    v.fallback(v.picklist(['small', 'medium', 'large']), DEFAULT_CARD_VIEW.cardSize),
    DEFAULT_CARD_VIEW.cardSize,
  ),
  showNames: v.optional(v.fallback(v.boolean(), DEFAULT_CARD_VIEW.showNames), DEFAULT_CARD_VIEW.showNames),
  showRatings: v.optional(v.fallback(v.boolean(), DEFAULT_CARD_VIEW.showRatings), DEFAULT_CARD_VIEW.showRatings),
  showYears: v.optional(v.fallback(v.boolean(), DEFAULT_CARD_VIEW.showYears), DEFAULT_CARD_VIEW.showYears),
});

export type MovieSearchParams = v.InferOutput<typeof MovieSearchSchema>;

export const SeriesSearchSchema = v.object({
  firstAirDateAfter: v.optional(CalendarDateParamSchema),
  firstAirDateBefore: v.optional(CalendarDateParamSchema),
  ratingMin: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_SERIES_SEARCH.ratingMax - 1)),
      DEFAULT_SERIES_SEARCH.ratingMin,
    ),
    DEFAULT_SERIES_SEARCH.ratingMin,
  ),
  ratingMax: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_SERIES_SEARCH.ratingMax)),
      DEFAULT_SERIES_SEARCH.ratingMax,
    ),
    DEFAULT_SERIES_SEARCH.ratingMax,
  ),
  voteCountMin: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_SERIES_SEARCH.voteCountMax - 1)),
      DEFAULT_SERIES_SEARCH.voteCountMin,
    ),
    DEFAULT_SERIES_SEARCH.voteCountMin,
  ),
  voteCountMax: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_SERIES_SEARCH.voteCountMax)),
      DEFAULT_SERIES_SEARCH.voteCountMax,
    ),
    DEFAULT_SERIES_SEARCH.voteCountMax,
  ),
  sort: v.optional(
    v.fallback(
      v.picklist(['first_air_date', 'name', 'popularity', 'vote_average', 'vote_count']),
      DEFAULT_SERIES_SEARCH.sort,
    ),
    DEFAULT_SERIES_SEARCH.sort,
  ),
  sortDir: v.optional(
    v.fallback(v.picklist(['asc', 'desc']), DEFAULT_SERIES_SEARCH.sortDir),
    DEFAULT_SERIES_SEARCH.sortDir,
  ),
  genres: v.optional(v.fallback(v.array(v.number()), DEFAULT_SERIES_SEARCH.genres), DEFAULT_SERIES_SEARCH.genres),
  status: v.optional(v.fallback(v.string(), DEFAULT_SERIES_SEARCH.status), DEFAULT_SERIES_SEARCH.status),
  types: v.optional(
    v.fallback(v.array(v.picklist(Object.values(DiscoverTVType))), DEFAULT_SERIES_SEARCH.types),
    DEFAULT_SERIES_SEARCH.types,
  ),
  keywords: v.optional(v.fallback(OptionsSchema, DEFAULT_SERIES_SEARCH.keywords), DEFAULT_SERIES_SEARCH.keywords),
  studios: v.optional(v.fallback(OptionsSchema, DEFAULT_SERIES_SEARCH.studios), DEFAULT_SERIES_SEARCH.studios),
  networks: v.optional(v.fallback(OptionsSchema, DEFAULT_SERIES_SEARCH.networks), DEFAULT_SERIES_SEARCH.networks),
  originalLanguage: v.optional(schemaObjectKeys(LANGUAGES_MAP)),
  watchProviders: v.optional(
    v.fallback(v.array(v.number()), DEFAULT_SERIES_SEARCH.watchProviders),
    DEFAULT_SERIES_SEARCH.watchProviders,
  ),
  adult: v.optional(v.fallback(v.boolean(), DEFAULT_SERIES_SEARCH.adult), DEFAULT_SERIES_SEARCH.adult),
  cardSize: v.optional(
    v.fallback(v.picklist(['small', 'medium', 'large']), DEFAULT_CARD_VIEW.cardSize),
    DEFAULT_CARD_VIEW.cardSize,
  ),
  showNames: v.optional(v.fallback(v.boolean(), DEFAULT_CARD_VIEW.showNames), DEFAULT_CARD_VIEW.showNames),
  showRatings: v.optional(v.fallback(v.boolean(), DEFAULT_CARD_VIEW.showRatings), DEFAULT_CARD_VIEW.showRatings),
  showYears: v.optional(v.fallback(v.boolean(), DEFAULT_CARD_VIEW.showYears), DEFAULT_CARD_VIEW.showYears),
});

export type SeriesSearchParams = v.InferOutput<typeof SeriesSearchSchema>;
