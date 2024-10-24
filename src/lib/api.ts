import {
  DiscoverMoviesOutputSchema,
  DiscoverMoviesQuerySchema,
  MovieDetailsOutputSchema,
  MovieProvidersOutputSchema,
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
        query: z
          .object({
            append_to_response: z.array(z.enum(['recommendations', 'similar', 'reviews', 'credits'])),
          })
          .default({
            append_to_response: ['recommendations', 'reviews', 'similar'],
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
    },
    { strict: true },
  ),
  plugins: [logger({ enabled: import.meta.env.DEV })],
});
