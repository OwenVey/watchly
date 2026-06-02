import { createFetch, createSchema } from '@better-fetch/fetch';
import { logger } from '@better-fetch/logger';
import { TMDB } from '@lorenzopant/tmdb';
import * as v from 'valibot';
import {
  CollectionOutputSchema,
  DiscoverMoviesOutputSchema,
  DiscoverMoviesQuerySchema,
  DiscoverSeriesOutputSchema,
  DiscoverSeriesQuerySchema,
  MovieDetailsOutputSchema,
  PersonDetailsOutputSchema,
  ProvidersOutputSchema,
  SearchCompanyOutputSchema,
  SearchKeywordOutputSchema,
  SearchMovieOutputSchema,
  SearchPersonOutputSchema,
  SearchTvOutputSchema,
  SeasonOutputSchema,
  SeriesDetailsOutputSchema,
} from '@/schemas';

export const tmdbApi2 = new TMDB(
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODVkYWNiNjA5ZTA1N2YyNmIxNTlhYTg3MjdjYTg2YiIsIm5iZiI6MTY3MjE2MzI5NS4wODQsInN1YiI6IjYzYWIyZmRmMDlkZGE0MDA3Y2I5ZDFlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ma51s5v9b_SQpKeHzHjZJvCQ-LvjGU6xCV0y6vY8Jf0',
);

export const tmdbApi = createFetch({
  baseURL: 'https://api.themoviedb.org/3',
  auth: {
    token:
      'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODVkYWNiNjA5ZTA1N2YyNmIxNTlhYTg3MjdjYTg2YiIsIm5iZiI6MTcyODc2Nzg2Ny4wNDA4NDksInN1YiI6IjYzYWIyZmRmMDlkZGE0MDA3Y2I5ZDFlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r3yoeC3McZsQGQPrVqYQyp7Wd1ZUnWstomt07OBhEBM',
    type: 'Bearer',
  },
  // retry: 3,
  throw: true,
  schema: createSchema(
    {
      '/collection/:collectionId': {
        output: CollectionOutputSchema,
        params: v.object({
          collectionId: v.string(),
        }),
      },
      '/discover/movie': {
        output: DiscoverMoviesOutputSchema,
        query: DiscoverMoviesQuerySchema,
      },
      '/discover/tv': {
        output: DiscoverSeriesOutputSchema,
        query: DiscoverSeriesQuerySchema,
      },
      '/genre/movie/list': {
        output: v.object({
          genres: v.array(v.object({ id: v.number(), name: v.string() })),
        }),
      },
      '/movie/:movieId': {
        output: MovieDetailsOutputSchema,
        query: v.object({
          append_to_response: v.pipe(
            v.tuple([
              v.literal('recommendations'),
              v.literal('similar'),
              v.literal('reviews'),
              v.literal('credits'),
              v.literal('release_dates'),
              v.literal('keywords'),
            ]),
            v.transform((values) => values.join(',')),
          ),
        }),
      },
      '/person/:personId': {
        output: PersonDetailsOutputSchema,
        params: v.object({
          personId: v.string(),
        }),
        query: v.object({
          append_to_response: v.tuple([v.literal('combined_credits')]),
        }),
      },
      '/person/popular': {
        output: SearchPersonOutputSchema,
        query: v.object({
          page: v.optional(v.number(), 1),
        }),
      },
      '/search/company': {
        output: SearchCompanyOutputSchema,
        query: v.object({
          page: v.optional(v.number(), 1),
          query: v.string(),
        }),
      },
      '/search/keyword': {
        output: SearchKeywordOutputSchema,
        query: v.object({
          page: v.optional(v.number(), 1),
          query: v.string(),
        }),
      },
      '/search/movie': {
        output: SearchMovieOutputSchema,
        query: v.object({
          page: v.optional(v.number(), 1),
          query: v.string(),
        }),
      },
      '/search/person': {
        output: SearchPersonOutputSchema,
        query: v.object({
          page: v.optional(v.number(), 1),
          query: v.string(),
        }),
      },
      '/search/tv': {
        output: SearchTvOutputSchema,
        query: v.object({
          page: v.optional(v.number(), 1),
          query: v.string(),
        }),
      },
      '/tv/:seriesId': {
        output: SeriesDetailsOutputSchema,
        query: v.object({
          append_to_response: v.pipe(
            v.tuple([
              v.literal('recommendations'),
              v.literal('similar'),
              v.literal('reviews'),
              v.literal('credits'),
              v.literal('external_ids'),
              v.literal('content_ratings'),
              v.literal('keywords'),
            ]),
            v.transform((values) => values.join(',')),
          ),
        }),
      },
      '/tv/:seriesId/season/:seasonNumber': {
        output: SeasonOutputSchema,
      },
      '/watch/providers/movie': {
        output: ProvidersOutputSchema,
        query: v.object({
          language: v.optional(v.string()),
          watch_region: v.string(),
        }),
      },
      '/watch/providers/tv': {
        output: ProvidersOutputSchema,
        query: v.object({
          language: v.optional(v.string()),
          watch_region: v.string(),
        }),
      },
    },
    { strict: true },
  ),
  plugins: [logger({ enabled: import.meta.env.DEV })],
});

export const omdbApi = createFetch({
  baseURL: 'https://www.omdbapi.com',
  query: {
    apikey: '3b1b9209',
  },
  // retry: 3,
  throw: true,
  schema: createSchema(
    {
      '/': {
        output: v.union([
          v.object({
            Ratings: v.array(
              v.object({
                Source: v.string(),
                Value: v.string(),
              }),
            ),
            Response: v.literal('True'),
            imdbRating: v.string(),
          }),
          v.object({
            Error: v.string(),
            Response: v.literal('False'),
          }),
        ]),
        query: v.object({
          apikey: v.optional(v.string(), '3b1b9209'),
          i: v.string(),
        }),
      },
    },
    { strict: true },
  ),
  plugins: [logger({ enabled: import.meta.env.DEV })],
});
