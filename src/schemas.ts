import * as v from 'valibot';
import { LANGUAGES_MAP } from '@/lib/constants';
import { schemaObjectKeys } from '@/lib/utils';

function paginated<T extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>>(resultSchema: T) {
  return v.object({
    page: v.number(),
    total_pages: v.number(),
    total_results: v.number(),
    results: v.array(resultSchema),
  });
}

export const OptionsSchema = v.array(v.object({ value: v.string(), label: v.string() }));

const StringToDateSchema = v.pipe(
  v.optional(v.nullable(v.string())),
  v.transform((val) => {
    if (val === '' || val == null) return undefined;
    return new Date(val);
  }),
);

const VoteAverageSchema = v.pipe(
  v.optional(v.number()),
  v.transform((num) => (num ? `${Math.round(num * 10)}%` : undefined)),
);

export const PersonSchema = v.object({
  adult: v.boolean(),
  gender: v.number(),
  id: v.number(),
  known_for_department: v.optional(v.nullable(v.string())),
  name: v.string(),
  original_name: v.string(),
  popularity: v.number(),
  profile_path: v.nullable(v.string()),
});

export const CreditsOutputSchema = v.object({
  cast: v.array(
    v.object({
      .../*@valibot-migrate we can't detect if PersonSchema has a `pipe` operator, if it does you might need to migrate this by hand otherwise it will loose it's pipeline*/
      PersonSchema.entries,

      cast_id: v.optional(v.number()),
      credit_id: v.string(),
      character: v.string(),
      order: v.number(),
    }),
  ),
  crew: v.array(
    v.object({
      .../*@valibot-migrate we can't detect if PersonSchema has a `pipe` operator, if it does you might need to migrate this by hand otherwise it will loose it's pipeline*/
      PersonSchema.entries,

      credit_id: v.string(),
      department: v.string(),
      job: v.string(),
    }),
  ),
});

export const MovieSchema = v.object({
  adult: v.boolean(),
  backdrop_path: v.nullable(v.string()),
  genre_ids: v.optional(v.array(v.number()), []),
  id: v.number(),
  original_language: schemaObjectKeys(LANGUAGES_MAP),
  original_title: v.string(),
  overview: v.string(),
  popularity: v.optional(v.optional(v.number()), 0),
  poster_path: v.nullable(v.string()),
  release_date: StringToDateSchema,
  title: v.string(),
  video: v.optional(v.optional(v.boolean()), false),
  vote_average: VoteAverageSchema,
  vote_count: v.optional(v.number()),
});

export const DiscoverMoviesQuerySchema = v.optional(
  v.object({
    certification: v.optional(v.string()),
    'certification.gte': v.optional(v.string()),
    'certification.lte': v.optional(v.string()),
    certification_country: v.optional(v.string()),
    include_adult: v.optional(v.boolean()),
    include_video: v.optional(v.boolean()),
    language: v.optional(v.string()),
    page: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
    'primary_release_date.gte': v.optional(v.string()), // Should be in YYYY-MM-DD format
    'primary_release_date.lte': v.optional(v.string()), // Should be in YYYY-MM-DD format
    primary_release_year: v.optional(v.pipe(v.number(), v.integer())),
    region: v.optional(v.string()),
    'release_date.gte': v.optional(v.string()), // Should be in YYYY-MM-DD format
    'release_date.lte': v.optional(v.string()), // Should be in YYYY-MM-DD format
    sort_by: v.optional(
      v.picklist([
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
      ]),
    ),
    'vote_average.gte': v.optional(v.number()),
    'vote_average.lte': v.optional(v.number()),
    'vote_count.gte': v.optional(v.pipe(v.number(), v.integer())),
    'vote_count.lte': v.optional(v.pipe(v.number(), v.integer())),
    watch_region: v.optional(v.string()),
    with_cast: v.optional(v.string()),
    with_companies: v.optional(v.string()),
    with_crew: v.optional(v.string()),
    with_genres: v.optional(v.string()),
    with_keywords: v.optional(v.string()),
    with_original_language: v.optional(v.string()),
    with_people: v.optional(v.string()),
    with_release_type: v.optional(v.union([v.string(), v.number()])),
    'with_runtime.gte': v.optional(v.pipe(v.number(), v.integer())),
    'with_runtime.lte': v.optional(v.pipe(v.number(), v.integer())),
    with_watch_monetization_types: v.optional(v.picklist(['flatrate', 'free', 'ads', 'rent', 'buy'])),
    with_watch_providers: v.optional(v.string()),
    without_genres: v.optional(v.string()),
    without_keywords: v.optional(v.string()),
    year: v.optional(v.pipe(v.number(), v.integer())),
  }),
);

export const DiscoverSeriesQuerySchema = v.optional(
  v.object({
    'air_date.gte': v.optional(v.string()),
    'air_date.lte': v.optional(v.string()),
    first_air_date_year: v.optional(v.number()),
    'first_air_date.gte': v.optional(v.string()),
    'first_air_date.lte': v.optional(v.string()),
    include_adult: v.optional(v.boolean()),
    include_null_first_air_dates: v.optional(v.boolean()),
    language: v.optional(v.string()),
    page: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
    screened_theatrically: v.optional(v.boolean()),
    sort_by: v.optional(
      v.picklist([
        'first_air_date.asc',
        'first_air_date.desc',
        'name.asc',
        'name.desc',
        'original_name.asc',
        'original_name.desc',
        'popularity.asc',
        'popularity.desc',
        'vote_average.asc',
        'vote_average.desc',
        'vote_count.asc',
        'vote_count.desc',
      ]),
    ),
    timezone: v.optional(v.string()),
    'vote_average.gte': v.optional(v.number()),
    'vote_average.lte': v.optional(v.number()),
    'vote_count.gte': v.optional(v.pipe(v.number(), v.integer())),
    'vote_count.lte': v.optional(v.pipe(v.number(), v.integer())),
    watch_region: v.optional(v.string()),
    with_companies: v.optional(v.string()),
    with_genres: v.optional(v.string()),
    with_keywords: v.optional(v.string()),
    with_networks: v.optional(v.string()),
    with_origin_country: v.optional(v.string()),
    with_original_language: v.optional(v.string()),
    'with_runtime.gte': v.optional(v.pipe(v.number(), v.integer())),
    'with_runtime.lte': v.optional(v.pipe(v.number(), v.integer())),
    with_status: v.optional(v.string()),
    with_watch_monetization_types: v.optional(v.string()),
    with_watch_providers: v.optional(v.string()),
    without_companies: v.optional(v.string()),
    without_genres: v.optional(v.string()),
    without_keywords: v.optional(v.string()),
    without_watch_providers: v.optional(v.string()),
    with_type: v.optional(v.string()),
  }),
);

export const DiscoverMoviesOutputSchema = paginated(MovieSchema);

export const ReviewsOutputSchema = paginated(
  v.object({
    author: v.string(),
    author_details: v.object({
      name: v.string(),
      username: v.string(),
      avatar_path: v.nullable(v.string()),
      rating: v.nullable(v.number()),
    }),
    content: v.string(),
    created_at: v.string(), // ISO date string
    id: v.string(),
    updated_at: v.string(), // ISO date string
    url: v.pipe(v.string(), v.url()),
  }),
);

export const SearchKeywordOutputSchema = paginated(
  v.object({
    id: v.number(),
    name: v.string(),
  }),
);

export const SearchCompanyOutputSchema = paginated(
  v.object({
    id: v.number(),
    logo_path: v.nullable(v.string()),
    name: v.string(),
    origin_country: v.string(),
  }),
);

export const SearchMovieOutputSchema = paginated(
  v.object({
    .../*@valibot-migrate we can't detect if MovieSchema has a `pipe` operator, if it does you might need to migrate this by hand otherwise it will loose it's pipeline*/
    MovieSchema.entries,

    media_type: v.optional(v.literal('movie'), 'movie'),
  }),
);

export const MovieReleaseTypeSchema = v.union([
  v.literal(1),
  v.literal(2),
  v.literal(3),
  v.literal(4),
  v.literal(5),
  v.literal(6),
]);

export const TvShowTypeSchema = v.union([
  v.literal(0),
  v.literal(1),
  v.literal(2),
  v.literal(3),
  v.literal(4),
  v.literal(5),
  v.literal(6),
]);

export const TvShowStatusSchema = v.union([
  v.literal(0),
  v.literal(1),
  v.literal(2),
  v.literal(3),
  v.literal(4),
  v.literal(5),
]);

export const ReleaseDatesOutputSchema = v.object({
  results: v.array(
    v.object({
      iso_3166_1: v.string(),
      release_dates: v.array(
        v.object({
          certification: v.string(),
          descriptors: v.array(v.string()),
          iso_639_1: v.string(),
          note: v.string(),
          release_date: v.pipe(v.unknown(), v.toDate()),
          type: MovieReleaseTypeSchema,
        }),
      ),
    }),
  ),
});

export const MovieDetailsOutputSchema = v.object({
  adult: v.boolean(),
  backdrop_path: v.nullable(v.string()),
  belongs_to_collection: v.nullable(
    v.object({
      id: v.number(),
      name: v.string(),
      poster_path: v.nullable(v.string()),
      backdrop_path: v.nullable(v.string()),
    }),
  ),
  budget: v.number(),
  credits: CreditsOutputSchema,
  genres: v.array(v.object({ id: v.number(), name: v.string() })),
  homepage: v.string(),
  id: v.number(),
  imdb_id: v.nullable(v.string()),
  keywords: v.object({
    keywords: v.array(
      v.object({
        id: v.number(),
        name: v.string(),
      }),
    ),
  }),
  origin_country: v.array(v.string()),
  original_language: schemaObjectKeys(LANGUAGES_MAP),
  original_title: v.string(),
  overview: v.string(),
  popularity: v.number(),
  poster_path: v.nullable(v.string()),
  production_companies: v.array(
    v.object({
      id: v.number(),
      logo_path: v.nullable(v.string()),
      name: v.string(),
      origin_country: v.string(),
    }),
  ),
  production_countries: v.array(v.object({ iso_3166_1: v.string(), name: v.string() })),
  recommendations: paginated(MovieSchema),
  release_date: StringToDateSchema,
  release_dates: ReleaseDatesOutputSchema,
  revenue: v.number(),
  reviews: ReviewsOutputSchema,
  runtime: v.number(),
  similar: paginated(MovieSchema),
  spoken_languages: v.array(
    v.object({
      english_name: v.string(),
      iso_639_1: v.string(),
      name: v.string(),
    }),
  ),
  status: v.string(),
  tagline: v.string(),
  title: v.string(),
  video: v.boolean(),
  vote_average: VoteAverageSchema,
  vote_count: v.number(),
});

export const SeriesSchema = v.object({
  adult: v.boolean(),
  backdrop_path: v.nullable(v.string()),
  genre_ids: v.array(v.number()),
  id: v.number(),
  origin_country: v.array(v.string()),
  original_language: v.string(),
  original_name: v.string(),
  overview: v.string(),
  popularity: v.number(),
  poster_path: v.nullable(v.string()),
  first_air_date: StringToDateSchema,
  name: v.string(),
  vote_average: VoteAverageSchema,
  vote_count: v.number(),
});

export const SeriesDetailsOutputSchema = v.object({
  adult: v.boolean(),
  backdrop_path: v.nullable(v.string()),
  content_ratings: v.object({
    results: v.array(
      v.object({
        iso_3166_1: v.string(),
        rating: v.string(),
      }),
    ),
  }),
  created_by: v.array(
    v.object({
      id: v.number(),
      credit_id: v.string(),
      name: v.string(),
      original_name: v.string(),
      gender: v.number(),
      profile_path: v.nullable(v.string()),
    }),
  ),
  credits: CreditsOutputSchema,
  episode_run_time: v.array(v.number()),
  external_ids: v.object({
    imdb_id: v.nullable(v.string()),
    freebase_mid: v.nullable(v.string()),
    freebase_id: v.nullable(v.string()),
    tvdb_id: v.nullable(v.number()),
    tvrage_id: v.nullable(v.number()),
    wikidata_id: v.nullable(v.string()),
    facebook_id: v.nullable(v.string()),
    instagram_id: v.nullable(v.string()),
    twitter_id: v.nullable(v.string()),
  }),
  first_air_date: StringToDateSchema,
  genres: v.array(
    v.object({
      id: v.number(),
      name: v.string(),
    }),
  ),
  homepage: v.string(),
  id: v.number(),
  in_production: v.boolean(),
  keywords: v.object({
    results: v.array(
      v.object({
        id: v.number(),
        name: v.string(),
      }),
    ),
  }),
  languages: v.array(v.string()),
  last_air_date: StringToDateSchema,
  last_episode_to_air: v.nullable(
    v.object({
      id: v.number(),
      name: v.string(),
      overview: v.string(),
      vote_average: VoteAverageSchema,
      vote_count: v.number(),
      air_date: StringToDateSchema,
      episode_number: v.number(),
      episode_type: v.string(),
      production_code: v.string(),
      runtime: v.nullable(v.number()),
      season_number: v.number(),
      show_id: v.optional(v.number()),
      still_path: v.nullable(v.string()),
    }),
  ),
  name: v.string(),
  next_episode_to_air: v.nullable(
    v.object({
      id: v.number(),
      name: v.string(),
      overview: v.string(),
      vote_average: VoteAverageSchema,
      vote_count: v.number(),
      air_date: StringToDateSchema,
      episode_number: v.number(),
      episode_type: v.string(),
      production_code: v.string(),
      runtime: v.nullable(v.number()),
      season_number: v.number(),
      show_id: v.optional(v.number()),
      still_path: v.nullable(v.string()),
    }),
  ),
  networks: v.array(
    v.object({
      id: v.number(),
      logo_path: v.nullable(v.string()),
      name: v.string(),
      origin_country: v.string(),
    }),
  ),
  number_of_episodes: v.nullable(v.number()),
  number_of_seasons: v.number(),
  origin_country: v.array(v.string()),
  original_language: schemaObjectKeys(LANGUAGES_MAP),
  original_name: v.string(),
  overview: v.string(),
  popularity: v.number(),
  poster_path: v.nullable(v.string()),
  production_companies: v.array(
    v.object({
      id: v.number(),
      logo_path: v.nullable(v.string()),
      name: v.string(),
      origin_country: v.string(),
    }),
  ),
  production_countries: v.array(
    v.object({
      iso_3166_1: v.string(),
      name: v.string(),
    }),
  ),
  recommendations: paginated(SeriesSchema),
  reviews: ReviewsOutputSchema,
  seasons: v.array(
    v.object({
      air_date: StringToDateSchema,
      episode_count: v.number(),
      id: v.number(),
      name: v.string(),
      overview: v.string(),
      poster_path: v.nullable(v.string()),
      season_number: v.number(),
      vote_average: VoteAverageSchema,
    }),
  ),
  similar: paginated(SeriesSchema),
  spoken_languages: v.array(
    v.object({
      english_name: v.string(),
      iso_639_1: v.string(),
      name: v.string(),
    }),
  ),
  status: v.string(),
  tagline: v.string(),
  type: v.string(),
  vote_average: VoteAverageSchema,
  vote_count: v.number(),
});

export const SeasonOutputSchema = v.object({
  _id: v.string(),
  air_date: v.nullable(v.string()),
  episodes: v.array(
    v.object({
      air_date: v.nullable(v.string()),
      episode_number: v.number(),
      episode_type: v.string(),
      id: v.number(),
      name: v.string(),
      overview: v.string(),
      production_code: v.string(),
      runtime: v.nullable(v.number()),
      season_number: v.number(),
      show_id: v.number(),
      still_path: v.nullable(v.string()),
      vote_average: VoteAverageSchema,
      vote_count: v.number(),
      crew: v.array(
        v.object({
          job: v.string(),
          department: v.string(),
          credit_id: v.string(),
          adult: v.boolean(),
          gender: v.number(),
          id: v.number(),
          known_for_department: v.string(),
          name: v.string(),
          original_name: v.string(),
          popularity: v.number(),
          profile_path: v.nullable(v.string()),
        }),
      ),
      guest_stars: v.array(
        v.object({
          character: v.string(),
          credit_id: v.string(),
          order: v.number(),
          adult: v.boolean(),
          gender: v.number(),
          id: v.number(),
          known_for_department: v.string(),
          name: v.string(),
          original_name: v.string(),
          popularity: v.number(),
          profile_path: v.nullable(v.string()),
        }),
      ),
    }),
  ),
  name: v.string(),
  overview: v.string(),
  id: v.number(),
  poster_path: v.nullable(v.string()),
  season_number: v.number(),
  vote_average: v.number(),
});

export const ProvidersOutputSchema = v.object({
  results: v.array(
    v.object({
      // display_priorities: z.record(z.number()),
      display_priority: v.number(),
      logo_path: v.nullable(v.string()),
      provider_name: v.string(),
      provider_id: v.number(),
    }),
  ),
});

export const DiscoverSeriesOutputSchema = paginated(SeriesSchema);

export const SearchTvOutputSchema = paginated(
  v.object({
    .../*@valibot-migrate we can't detect if SeriesSchema has a `pipe` operator, if it does you might need to migrate this by hand otherwise it will loose it's pipeline*/
    SeriesSchema.entries,

    media_type: v.optional(v.literal('tv'), 'tv'),
  }),
);

export const SearchPersonOutputSchema = paginated(
  v.object({
    .../*@valibot-migrate we can't detect if PersonSchema has a `pipe` operator, if it does you might need to migrate this by hand otherwise it will loose it's pipeline*/
    PersonSchema.entries,

    media_type: v.optional(v.literal('person'), 'person'),

    known_for: v.array(
      v.union([
        v.object({
          .../*@valibot-migrate we can't detect if MovieSchema has a `pipe` operator, if it does you might need to migrate this by hand otherwise it will loose it's pipeline*/
          MovieSchema.entries,

          media_type: v.literal('movie'),
        }),
        v.object({
          .../*@valibot-migrate we can't detect if SeriesSchema has a `pipe` operator, if it does you might need to migrate this by hand otherwise it will loose it's pipeline*/
          SeriesSchema.entries,

          media_type: v.literal('tv'),
        }),
      ]),
    ),
  }),
);

export const PersonDetailsOutputSchema = v.object({
  adult: v.boolean(),
  also_known_as: v.array(v.string()),
  biography: v.string(),
  birthday: v.pipe(v.unknown(), v.toDate()),
  deathday: v.nullable(v.string()),
  gender: v.number(),
  homepage: v.nullable(v.string()),
  id: v.number(),
  imdb_id: v.nullable(v.string()),
  known_for_department: v.string(),
  name: v.string(),
  place_of_birth: v.nullable(v.string()),
  popularity: v.number(),
  profile_path: v.nullable(v.string()),
  combined_credits: v.object({
    cast: v.array(
      v.union([
        v.object({
          .../*@valibot-migrate we can't detect if MovieSchema has a `pipe` operator, if it does you might need to migrate this by hand otherwise it will loose it's pipeline*/
          MovieSchema.entries,

          media_type: v.literal('movie'),
          character: v.string(),
        }),
        v.object({
          .../*@valibot-migrate we can't detect if SeriesSchema has a `pipe` operator, if it does you might need to migrate this by hand otherwise it will loose it's pipeline*/
          SeriesSchema.entries,

          media_type: v.literal('tv'),
          character: v.string(),
        }),
      ]),
    ),
    crew: v.array(
      v.union([
        v.object({
          .../*@valibot-migrate we can't detect if MovieSchema has a `pipe` operator, if it does you might need to migrate this by hand otherwise it will loose it's pipeline*/
          MovieSchema.entries,

          media_type: v.literal('movie'),
          job: v.string(),
        }),
        v.object({
          .../*@valibot-migrate we can't detect if SeriesSchema has a `pipe` operator, if it does you might need to migrate this by hand otherwise it will loose it's pipeline*/
          SeriesSchema.entries,

          media_type: v.literal('tv'),
          job: v.string(),
        }),
      ]),
    ),
  }),
});

export const CollectionOutputSchema = v.object({
  id: v.number(),
  name: v.string(),
  overview: v.string(),
  poster_path: v.string(),
  backdrop_path: v.string(),
  parts: v.array(MovieSchema),
});

export const MediaTypeSchema = v.union([v.literal('all'), v.literal('movies'), v.literal('tv'), v.literal('people')]);
