import { createFetch, createSchema } from '@better-fetch/fetch';
import { logger } from '@better-fetch/logger';
import { TMDB } from '@lorenzopant/tmdb';
import * as v from 'valibot';

const BEARER_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODVkYWNiNjA5ZTA1N2YyNmIxNTlhYTg3MjdjYTg2YiIsIm5iZiI6MTY3MjE2MzI5NS4wODQsInN1YiI6IjYzYWIyZmRmMDlkZGE0MDA3Y2I5ZDFlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ma51s5v9b_SQpKeHzHjZJvCQ-LvjGU6xCV0y6vY8Jf0';

export const tmdbApi = new TMDB(BEARER_TOKEN, {
  logger: import.meta.env.DEV,
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
