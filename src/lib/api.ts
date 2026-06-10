import { createFetch, createSchema } from '@better-fetch/fetch';
import { logger } from '@better-fetch/logger';
import { TMDB, type TMDBOptions } from '@lorenzopant/tmdb';
import * as v from 'valibot';

const BEARER_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ODVkYWNiNjA5ZTA1N2YyNmIxNTlhYTg3MjdjYTg2YiIsIm5iZiI6MTY3MjE2MzI5NS4wODQsInN1YiI6IjYzYWIyZmRmMDlkZGE0MDA3Y2I5ZDFlZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ma51s5v9b_SQpKeHzHjZJvCQ-LvjGU6xCV0y6vY8Jf0';

export const tmdbApi = new TMDB(BEARER_TOKEN, {
  interceptors: {
    // request: () => new Promise((resolve) => setTimeout(resolve, 2000)),
  },
  logger: import.meta.env.DEV,
  region: 'US',
  timezone: (Intl.DateTimeFormat().resolvedOptions().timeZone as TMDBOptions['timezone']) ?? 'America/Chicago',
  images: {
    autocomplete_paths: true,
    auto_include_image_language: true,
    image_language_priority: {
      // 1. textless posters first  2. English  3. any remaining
      backdrops: ['null', 'en', '*'],
      logos: ['null', 'en', '*'],
      posters: ['null', 'en', '*'],
      profiles: ['null', 'en', '*'],
      stills: ['null', 'en', '*'],
    },
    default_image_sizes: {
      backdrops: 'w1280',
      logos: 'w92',
      posters: 'w342',
      profiles: 'w185',
      still: 'w300',
    },
  },
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
            imdbVotes: v.string(),
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
