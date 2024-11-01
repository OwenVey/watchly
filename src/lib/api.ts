import {
  DiscoverMoviesOutputSchema,
  DiscoverMoviesQuerySchema,
  MovieDetailsOutputSchema,
  MovieProvidersOutputSchema,
  PersonDetailsOutputSchema,
  SearchCompanyOutputSchema,
  SearchKeywordOutputSchema,
  SearchMovieOutputSchema,
  SearchPersonOutputSchema,
  SearchTvOutputSchema,
} from '@/schemas';
import { createFetch, createSchema } from '@better-fetch/fetch';
import { logger } from '@better-fetch/logger';
import { z } from 'zod';

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
      '/genre/movie/list': {
        output: z.object({
          genres: z.array(z.object({ id: z.number(), name: z.string() })),
        }),
      },
      '/movie/:movieId': {
        params: z.object({
          movieId: z.string(),
        }),
        query: z.object({
          append_to_response: z.tuple([
            z.literal('recommendations'),
            z.literal('similar'),
            z.literal('reviews'),
            z.literal('credits'),
            z.literal('release_dates'),
            z.literal('keywords'),
          ]),
        }),
        output: MovieDetailsOutputSchema,
      },
      '/watch/providers/movie': {
        query: z.object({
          language: z.string().optional(),
          watch_region: z.string(),
        }),
        output: MovieProvidersOutputSchema,
      },
      '/search/keyword': {
        query: z.object({
          query: z.string(),
          page: z.number().default(1),
        }),
        output: SearchKeywordOutputSchema,
      },
      '/search/company': {
        query: z.object({
          query: z.string(),
          page: z.number().default(1),
        }),
        output: SearchCompanyOutputSchema,
      },
      '/search/movie': {
        query: z.object({
          query: z.string(),
          page: z.number().default(1),
        }),
        output: SearchMovieOutputSchema,
      },
      '/search/tv': {
        query: z.object({
          query: z.string(),
          page: z.number().default(1),
        }),
        output: SearchTvOutputSchema,
      },
      '/search/person': {
        query: z.object({
          query: z.string(),
          page: z.number().default(1),
        }),
        output: SearchPersonOutputSchema,
      },
      '/person/popular': {
        query: z.object({
          page: z.number().default(1),
        }),
        output: SearchPersonOutputSchema,
      },
      '/person/:personId': {
        params: z.object({
          personId: z.string(),
        }),
        query: z.object({
          append_to_response: z.tuple([z.literal('combined_credits')]),
        }),
        output: PersonDetailsOutputSchema,
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
        query: z.object({
          apikey: z.string().default('3b1b9209'),
          i: z.string(),
        }),
        output: z.object({
          Title: z.string(),
          Year: z.string(),
          Rated: z.string(),
          Released: z.string(),
          Runtime: z.string(),
          Genre: z.string(),
          Director: z.string(),
          Writer: z.string(),
          Actors: z.string(),
          Plot: z.string(),
          Language: z.string(),
          Country: z.string(),
          Awards: z.string(),
          Poster: z.string(),
          Ratings: z.array(
            z.object({
              Source: z.string(),
              Value: z.string(),
            }),
          ),
          Metascore: z.string(),
          imdbRating: z.string(),
          imdbVotes: z.string(),
          imdbID: z.string(),
          Type: z.string(),
          DVD: z.string(),
          BoxOffice: z.string(),
          Production: z.string(),
          Website: z.string(),
          Response: z.string(),
        }),
      },
    },
    { strict: true },
  ),
  plugins: [logger({ enabled: import.meta.env.DEV })],
});
