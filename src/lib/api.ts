import { createFetch, createSchema } from '@better-fetch/fetch';
import { logger } from '@better-fetch/logger';
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

export const tmdbApi = createFetch({
  baseURL: 'https://api.themoviedb.org/3',
  auth: {
    type: 'Bearer',
    token:
      'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODVkYWNiNjA5ZTA1N2YyNmIxNTlhYTg3MjdjYTg2YiIsIm5iZiI6MTcyODc2Nzg2Ny4wNDA4NDksInN1YiI6IjYzYWIyZmRmMDlkZGE0MDA3Y2I5ZDFlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.r3yoeC3McZsQGQPrVqYQyp7Wd1ZUnWstomt07OBhEBM',
  },
  // retry: 3,
  throw: true,
  schema: createSchema(
    {
      '/discover/movie': {
        query: DiscoverMoviesQuerySchema,
        output: DiscoverMoviesOutputSchema,
      },
      '/discover/tv': {
        query: DiscoverSeriesQuerySchema,
        output: DiscoverSeriesOutputSchema,
      },
      '/genre/movie/list': {
        output: v.object({
          genres: v.array(v.object({ id: v.number(), name: v.string() })),
        }),
      },
      '/movie/:movieId': {
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
        output: MovieDetailsOutputSchema,
      },
      '/tv/:seriesId': {
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
        output: SeriesDetailsOutputSchema,
      },
      '/tv/:seriesId/season/:seasonNumber': {
        output: SeasonOutputSchema,
      },
      '/watch/providers/movie': {
        query: v.object({
          language: v.optional(v.string()),
          watch_region: v.string(),
        }),
        output: ProvidersOutputSchema,
      },
      '/watch/providers/tv': {
        query: v.object({
          language: v.optional(v.string()),
          watch_region: v.string(),
        }),
        output: ProvidersOutputSchema,
      },
      '/search/keyword': {
        query: v.object({
          query: v.string(),
          page: v.optional(v.number(), 1),
        }),
        output: SearchKeywordOutputSchema,
      },
      '/search/company': {
        query: v.object({
          query: v.string(),
          page: v.optional(v.number(), 1),
        }),
        output: SearchCompanyOutputSchema,
      },
      '/search/movie': {
        query: v.object({
          query: v.string(),
          page: v.optional(v.number(), 1),
        }),
        output: SearchMovieOutputSchema,
      },
      '/search/tv': {
        query: v.object({
          query: v.string(),
          page: v.optional(v.number(), 1),
        }),
        output: SearchTvOutputSchema,
      },
      '/search/person': {
        query: v.object({
          query: v.string(),
          page: v.optional(v.number(), 1),
        }),
        output: SearchPersonOutputSchema,
      },
      '/person/popular': {
        query: v.object({
          page: v.optional(v.number(), 1),
        }),
        output: SearchPersonOutputSchema,
      },
      '/person/:personId': {
        params: v.object({
          personId: v.string(),
        }),
        query: v.object({
          append_to_response: v.tuple([v.literal('combined_credits')]),
        }),
        output: PersonDetailsOutputSchema,
      },
      '/collection/:collectionId': {
        params: v.object({
          collectionId: v.string(),
        }),
        output: CollectionOutputSchema,
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
        query: v.object({
          apikey: v.optional(v.string(), '3b1b9209'),
          i: v.string(),
        }),
        output: v.object({
          // Title: z.string(),
          // Year: z.string(),
          // Rated: z.string(),
          // Released: z.string(),
          // Runtime: z.string(),
          // Genre: z.string(),
          // Director: z.string(),
          // Writer: z.string(),
          // Actors: z.string(),
          // Plot: z.string(),
          // Language: z.string(),
          // Country: z.string(),
          // Awards: z.string(),
          // Poster: z.string(),
          Ratings: v.array(
            v.object({
              Source: v.string(),
              Value: v.string(),
            }),
          ),
          // Metascore: z.string(),
          imdbRating: v.string(),
          // imdbVotes: z.string(),
          // imdbID: z.string(),
          // Type: z.string(),
          // DVD: z.string(),
          // BoxOffice: z.string(),
          // Production: z.string(),
          // Website: z.string(),
          // Response: z.string(),
        }),
      },
    },
    { strict: true },
  ),
  plugins: [logger({ enabled: import.meta.env.DEV })],
});
