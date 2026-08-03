import { createFetch, createSchema } from '@better-fetch/fetch';
import { TMDB, type TMDBOptions } from '@lorenzopant/tmdb';
import * as v from 'valibot';
import { ENV } from 'varlock/env';

export const getTmdbApi = (): TMDB =>
  new TMDB(ENV.TMDB_API_KEY, {
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

export const getOmdbApi = () => {
  return createFetch({
    baseURL: 'https://www.omdbapi.com',
    query: { apikey: ENV.OMDB_API_KEY },
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
            apikey: v.optional(v.string()),
            i: v.string(),
          }),
        },
      },
      { strict: true },
    ),
  });
};
