import { LANGUAGES_MAP } from '@/lib/constants';
import { zodObjectKeys } from '@/lib/utils';
import { z } from 'zod';

function paginated<T extends z.ZodTypeAny>(resultSchema: T) {
  return z.object({
    page: z.number(),
    total_pages: z.number(),
    total_results: z.number(),
    results: z.array(resultSchema),
  });
}
const VoteAverageSchema = z
  .number()
  .optional()
  .transform((num) => (num ? `${Math.round(num * 10)}%` : undefined));

export const MovieSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  genre_ids: z.array(z.number()).default([]),
  id: z.number(),
  original_language: zodObjectKeys(LANGUAGES_MAP),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number().optional(),
  poster_path: z.string().nullable(),
  release_date: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(z.coerce.date().optional()),
  title: z.string(),
  video: z.boolean().optional().default(false),
  vote_average: VoteAverageSchema,
  vote_count: z.number().optional(),
});

export const DiscoverMoviesQuerySchema = z
  .object({
    certification: z.string().optional(),
    certification_country: z.string().optional(),
    'certification.gte': z.string().optional(),
    'certification.lte': z.string().optional(),
    include_adult: z.boolean().optional(),
    include_video: z.boolean().optional(),
    language: z.string().optional(),
    page: z.number().int().min(1).optional(),
    'primary_release_date.gte': z.string().optional(), // Should be in YYYY-MM-DD format
    'primary_release_date.lte': z.string().optional(), // Should be in YYYY-MM-DD format
    primary_release_year: z.number().int().optional(),
    region: z.string().optional(),
    'release_date.gte': z.string().optional(), // Should be in YYYY-MM-DD format
    'release_date.lte': z.string().optional(), // Should be in YYYY-MM-DD format
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
        'title.asc',
        'title.desc',
        'vote_average.asc',
        'vote_average.desc',
        'vote_count.asc',
        'vote_count.desc',
      ])
      .optional(),
    'vote_average.gte': z.number().optional(),
    'vote_average.lte': z.number().optional(),
    'vote_count.gte': z.number().int().optional(),
    'vote_count.lte': z.number().int().optional(),
    watch_region: z.string().optional(),
    with_cast: z.string().optional(),
    with_companies: z.string().optional(),
    with_crew: z.string().optional(),
    with_genres: z.string().optional(),
    with_keywords: z.string().optional(),
    with_original_language: z.string().optional(),
    with_people: z.string().optional(),
    with_release_type: z.union([z.string(), z.number()]).optional(),
    'with_runtime.gte': z.number().int().optional(),
    'with_runtime.lte': z.number().int().optional(),
    with_watch_monetization_types: z.enum(['flatrate', 'free', 'ads', 'rent', 'buy']).optional(),
    with_watch_providers: z.string().optional(),
    without_genres: z.string().optional(),
    without_keywords: z.string().optional(),
    year: z.number().int().optional(),
  })
  .optional();

export const DiscoverMoviesOutputSchema = paginated(MovieSchema);

export const RecommendationsOutputSchema = paginated(
  MovieSchema.extend({
    media_type: z.enum(['movie', 'tv']),
  }),
);

export const CreditsOutputSchema = z.object({
  cast: z.array(
    z.object({
      adult: z.boolean(),
      gender: z.number(),
      id: z.number(),
      known_for_department: z.string(),
      name: z.string(),
      original_name: z.string(),
      popularity: z.number(),
      profile_path: z.string().nullable(),
      cast_id: z.number(),
      character: z.string(),
      credit_id: z.string(),
      order: z.number(),
    }),
  ),
  crew: z.array(
    z.object({
      adult: z.boolean(),
      gender: z.number(),
      id: z.number(),
      known_for_department: z.string(),
      name: z.string(),
      original_name: z.string(),
      popularity: z.number(),
      profile_path: z.string().nullable(),
      credit_id: z.string(),
      department: z.string(),
      job: z.string(),
    }),
  ),
});

export const SimilarMoviesOutputSchema = paginated(MovieSchema);

export const ReviewsOutputSchema = paginated(
  z.object({
    author: z.string(),
    author_details: z.object({
      name: z.string(),
      username: z.string(),
      avatar_path: z.string().nullable(),
      rating: z.number().nullable(),
    }),
    content: z.string(),
    created_at: z.string(), // ISO date string
    id: z.string(),
    updated_at: z.string(), // ISO date string
    url: z.string().url(),
  }),
);

export const ReleaseTypeSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);

export const ReleaseDatesOutputSchema = z.object({
  results: z.array(
    z.object({
      iso_3166_1: z.string(),
      release_dates: z.array(
        z.object({
          certification: z.string(),
          descriptors: z.array(z.string()),
          iso_639_1: z.string(),
          note: z.string(),
          release_date: z.coerce.date(),
          type: ReleaseTypeSchema,
        }),
      ),
    }),
  ),
});

export const MovieDetailsOutputSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  belongs_to_collection: z
    .object({
      id: z.number(),
      name: z.string(),
      poster_path: z.string().nullable(),
      backdrop_path: z.string().nullable(),
    })
    .nullable(),
  budget: z.number(),
  credits: CreditsOutputSchema,
  genres: z.array(z.object({ id: z.number(), name: z.string() })),
  homepage: z.string(),
  id: z.number(),
  imdb_id: z.string().nullable(),
  keywords: z.object({
    keywords: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
      }),
    ),
  }),
  origin_country: z.array(z.string()),
  original_language: zodObjectKeys(LANGUAGES_MAP),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string().nullable(),
  production_companies: z.array(
    z.object({
      id: z.number(),
      logo_path: z.string().nullable(),
      name: z.string(),
      origin_country: z.string(),
    }),
  ),
  production_countries: z.array(z.object({ iso_3166_1: z.string(), name: z.string() })),
  recommendations: RecommendationsOutputSchema,
  release_date: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val))
    .pipe(z.coerce.date().optional()),
  release_dates: ReleaseDatesOutputSchema,
  revenue: z.number(),
  reviews: ReviewsOutputSchema,
  runtime: z.number(),
  similar: SimilarMoviesOutputSchema,
  spoken_languages: z.array(
    z.object({
      english_name: z.string(),
      iso_639_1: z.string(),
      name: z.string(),
    }),
  ),
  status: z.string(),
  tagline: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: VoteAverageSchema,
  vote_count: z.number(),
});

export const MovieProvidersOutputSchema = z.object({
  results: z.array(
    z.object({
      // display_priorities: z.record(z.number()),
      display_priority: z.number(),
      logo_path: z.string().nullable(),
      provider_name: z.string(),
      provider_id: z.number(),
    }),
  ),
});
