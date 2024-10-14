import { createFetch, createSchema } from '@better-fetch/fetch';
import { logger } from '@better-fetch/logger';
import { z } from 'zod';

export const movieApi = createFetch({
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
        query: z
          .object({
            certification: z.string().optional(),
            certification_country: z.string().optional(),
            certification_gte: z.string().optional(),
            certification_lte: z.string().optional(),
            include_adult: z.boolean().optional(),
            include_video: z.boolean().optional(),
            language: z.string().optional(),
            page: z.number().int().min(1).optional(),
            primary_release_date_gte: z.string().optional(), // Should be in YYYY-MM-DD format
            primary_release_date_lte: z.string().optional(), // Should be in YYYY-MM-DD format
            primary_release_year: z.number().int().optional(),
            region: z.string().optional(),
            release_date_gte: z.string().optional(), // Should be in YYYY-MM-DD format
            release_date_lte: z.string().optional(), // Should be in YYYY-MM-DD format
            sort_by: z
              .enum([
                'popularity.asc',
                'popularity.desc',
                'release_date.asc',
                'release_date.desc',
                'revenue.asc',
                'revenue.desc',
                'primary_release_date.asc',
                'primary_release_date.desc',
                'original_title.asc',
                'original_title.desc',
                'vote_average.asc',
                'vote_average.desc',
                'vote_count.asc',
                'vote_count.desc',
              ])
              .optional(),
            vote_average_gte: z.number().optional(),
            vote_average_lte: z.number().optional(),
            vote_count_gte: z.number().int().optional(),
            vote_count_lte: z.number().int().optional(),
            watch_region: z.string().optional(),
            with_cast: z.string().optional(),
            with_companies: z.string().optional(),
            with_crew: z.string().optional(),
            with_genres: z.string().optional(),
            with_keywords: z.string().optional(),
            with_original_language: z.string().optional(),
            with_people: z.string().optional(),
            with_release_type: z.number().optional(),
            with_runtime_gte: z.number().int().optional(),
            with_runtime_lte: z.number().int().optional(),
            with_watch_monetization_types: z
              .enum(['flatrate', 'free', 'ads', 'rent', 'buy'])
              .optional(),
            with_watch_providers: z.string().optional(),
            without_genres: z.string().optional(),
            without_keywords: z.string().optional(),
            year: z.number().int().optional(),
          })
          .optional(),
        output: z.object({
          page: z.number(),
          results: z.array(
            z.object({
              adult: z.boolean(),
              backdrop_path: z.string().nullable(),
              genre_ids: z.array(z.number()).default([]),
              id: z.number(),
              original_language: z.string(),
              original_title: z.string(),
              overview: z.string(),
              popularity: z.number().optional(),
              poster_path: z.string().nullable(),
              release_date: z.string().optional(),
              title: z.string(),
              video: z.boolean().optional().default(false),
              vote_average: z
                .number()
                .optional()
                .default(0)
                .transform((num) => Math.round(num * 10) / 10),
              vote_count: z.number().optional().default(0),
            }),
          ),
          total_pages: z.number(),
          total_results: z.number(),
        }),
      },
      '/genre/movie/list': {
        output: z.object({
          genres: z.array(z.object({ id: z.number(), name: z.string() })),
        }),
      },
    },
    { strict: true },
  ),
  plugins: [logger({ enabled: true })],
});
