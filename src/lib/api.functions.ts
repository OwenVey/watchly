import { type LanguageISO6391 } from '@lorenzopant/tmdb';
import { createServerFn } from '@tanstack/react-start';
import * as v from 'valibot';
import { getOmdbApi, getTmdbApi } from '@/lib/api.server';
import { DEFAULT_MOVIE_SEARCH, DEFAULT_SERIES_SEARCH, OMDB_ENABLED } from '@/lib/constants';
import { MovieSearchSchema, SeriesSearchSchema, TrendingMediaTypeSchema } from '@/schemas';

const PageSchema = v.pipe(v.number(), v.integer(), v.minValue(1));
const IdSchema = v.pipe(v.number(), v.integer(), v.minValue(1));
const QuerySchema = v.pipe(v.string(), v.trim(), v.minLength(1), v.maxLength(200));

export const getMovies = createServerFn({ method: 'GET' })
  .validator(v.object({ page: PageSchema, params: MovieSearchSchema }))
  .handler(async ({ data: { page, params } }) => {
    const tmdbApi = getTmdbApi();
    const pagesToFetch = [page, page + 1, page + 2];
    const responses = await Promise.all(
      pagesToFetch.map((pageToFetch) =>
        tmdbApi.discover.movie({
          page: pageToFetch,
          ...(params.adult !== DEFAULT_MOVIE_SEARCH.adult && { include_adult: params.adult }),
          ...(params.releasedAfter !== DEFAULT_MOVIE_SEARCH.releasedAfter && {
            'primary_release_date.gte': params.releasedAfter,
          }),
          ...(params.releasedBefore !== DEFAULT_MOVIE_SEARCH.releasedBefore && {
            'primary_release_date.lte': params.releasedBefore,
          }),
          ...(params.ratingMin !== DEFAULT_MOVIE_SEARCH.ratingMin && { 'vote_average.gte': params.ratingMin }),
          ...(params.ratingMax !== DEFAULT_MOVIE_SEARCH.ratingMax && { 'vote_average.lte': params.ratingMax }),
          ...(params.voteCountMin !== DEFAULT_MOVIE_SEARCH.voteCountMin && { 'vote_count.gte': params.voteCountMin }),
          ...(params.voteCountMax !== DEFAULT_MOVIE_SEARCH.voteCountMax && { 'vote_count.lte': params.voteCountMax }),
          ...(params.runtimeMin !== DEFAULT_MOVIE_SEARCH.runtimeMin && { 'with_runtime.gte': params.runtimeMin }),
          ...(params.runtimeMax !== DEFAULT_MOVIE_SEARCH.runtimeMax && { 'with_runtime.lte': params.runtimeMax }),
          ...((params.sort !== DEFAULT_MOVIE_SEARCH.sort || params.sortDir !== DEFAULT_MOVIE_SEARCH.sortDir) && {
            sort_by: `${params.sort}.${params.sortDir}`,
          }),
          ...(params.genres.length > 0 && { with_genres: params.genres.join(',') }),
          ...(params.releaseTypes.length > 0 && { with_release_type: params.releaseTypes.join('|') }),
          ...(params.keywords.length > 0 && { with_keywords: params.keywords.map(({ value }) => value).join(',') }),
          ...(params.studios.length > 0 && { with_companies: params.studios.map(({ value }) => value).join(',') }),
          ...(params.originalLanguage && { with_original_language: params.originalLanguage as LanguageISO6391 }),
          ...(params.watchProviders.length > 0 && {
            watch_region: 'US',
            with_watch_providers: params.watchProviders.join('|'),
          }),
        }),
      ),
    );

    const lastResponse = responses.at(-1);
    return {
      page: lastResponse?.page ?? 0,
      results: Array.from(
        new Map(responses.flatMap(({ results }) => results.map((movie) => [movie.id, movie]))).values(),
      ),
      totalPages: lastResponse?.total_pages ?? 0,
      totalResults: lastResponse?.total_results ?? 0,
    };
  });

export const getSeries = createServerFn({ method: 'GET' })
  .validator(v.object({ page: PageSchema, params: SeriesSearchSchema }))
  .handler(async ({ data: { page, params } }) => {
    const tmdbApi = getTmdbApi();
    const pagesToFetch = [page, page + 1, page + 2];
    const responses = await Promise.all(
      pagesToFetch.map((pageToFetch) =>
        tmdbApi.discover.tv({
          page: pageToFetch,
          ...(params.adult !== DEFAULT_SERIES_SEARCH.adult && { include_adult: params.adult }),
          ...(params.firstAirDateAfter !== DEFAULT_SERIES_SEARCH.firstAirDateAfter && {
            'first_air_date.gte': params.firstAirDateAfter,
          }),
          ...(params.firstAirDateBefore !== DEFAULT_SERIES_SEARCH.firstAirDateBefore && {
            'first_air_date.lte': params.firstAirDateBefore,
          }),
          ...(params.ratingMin !== DEFAULT_SERIES_SEARCH.ratingMin && { 'vote_average.gte': params.ratingMin }),
          ...(params.ratingMax !== DEFAULT_SERIES_SEARCH.ratingMax && { 'vote_average.lte': params.ratingMax }),
          ...(params.voteCountMin !== DEFAULT_SERIES_SEARCH.voteCountMin && { 'vote_count.gte': params.voteCountMin }),
          ...(params.voteCountMax !== DEFAULT_SERIES_SEARCH.voteCountMax && { 'vote_count.lte': params.voteCountMax }),
          ...((params.sort !== DEFAULT_SERIES_SEARCH.sort || params.sortDir !== DEFAULT_SERIES_SEARCH.sortDir) && {
            sort_by: `${params.sort}.${params.sortDir}`,
          }),
          ...(params.genres.length > 0 && { with_genres: params.genres.join(',') }),
          ...(params.status.length > 0 && { with_status: params.status }),
          ...(params.types.length > 0 && { with_type: params.types.join('|') }),
          ...(params.keywords.length > 0 && { with_keywords: params.keywords.map(({ value }) => value).join(',') }),
          ...(params.studios.length > 0 && { with_companies: params.studios.map(({ value }) => value).join(',') }),
          ...(params.networks.length > 0 && { with_networks: params.networks.map(({ value }) => value).join(',') }),
          ...(params.originalLanguage && { with_original_language: params.originalLanguage as LanguageISO6391 }),
          ...(params.watchProviders.length > 0 && {
            watch_region: 'US',
            with_watch_providers: params.watchProviders.join('|'),
          }),
        }),
      ),
    );

    const lastResponse = responses.at(-1);
    return {
      page: lastResponse?.page ?? 0,
      results: Array.from(
        new Map(responses.flatMap(({ results }) => results.map((series) => [series.id, series]))).values(),
      ),
      totalPages: lastResponse?.total_pages ?? 0,
      totalResults: lastResponse?.total_results ?? 0,
    };
  });

export const getSeriesDetails = createServerFn({ method: 'GET' })
  .validator(v.object({ seriesId: IdSchema }))
  .handler(async ({ data: { seriesId } }) =>
    getTmdbApi().tv_series.details({
      series_id: seriesId,
      append_to_response: ['recommendations', 'similar', 'credits', 'external_ids', 'keywords', 'content_ratings'],
    }),
  );

// TMDB types release-date descriptors as unknown[], though the payload is JSON-serializable.
export const getMovieDetails = createServerFn({ method: 'GET', strict: { output: false } })
  .validator(v.object({ movieId: IdSchema }))
  .handler(async ({ data: { movieId } }) =>
    getTmdbApi().movies.details({
      movie_id: movieId,
      append_to_response: ['recommendations', 'similar', 'credits', 'release_dates', 'keywords'],
    }),
  );

export const getCollectionDetails = createServerFn({ method: 'GET' })
  .validator(v.object({ collectionId: IdSchema }))
  .handler(async ({ data: { collectionId } }) => getTmdbApi().collections.details({ collection_id: collectionId }));

export const getOmdbRatings = createServerFn({ method: 'GET' })
  .validator(v.object({ imdbId: v.pipe(v.string(), v.regex(/^tt\d+$/)) }))
  .handler(async ({ data: { imdbId } }) => {
    if (!OMDB_ENABLED) {
      return null;
    }

    const omdbResponse = await getOmdbApi()('/', { query: { i: imdbId } });
    return omdbResponse.Response === 'True' ? omdbResponse : null;
  });

export const getMovieWatchProviders = createServerFn({ method: 'GET' }).handler(async () =>
  getTmdbApi().watch_providers.movie_providers(),
);

export const getSeriesWatchProviders = createServerFn({ method: 'GET' }).handler(async () =>
  getTmdbApi().watch_providers.tv_providers(),
);

export const searchMedia = createServerFn({ method: 'GET' })
  .validator(v.object({ page: PageSchema, query: QuerySchema }))
  .handler(async ({ data: { page, query } }) => {
    const response = await getTmdbApi().search.multi({ query, page });
    return { ...response, results: response.results.sort((a, b) => b.popularity - a.popularity) };
  });

export const getPopularPeople = createServerFn({ method: 'GET' })
  .validator(v.object({ page: PageSchema }))
  .handler(async ({ data: { page } }) => {
    const tmdbApi = getTmdbApi();
    const pagesToFetch = [page, page + 1, page + 2];
    const responses = await Promise.all(
      pagesToFetch.map((pageToFetch) => tmdbApi.people_lists.popular({ page: pageToFetch })),
    );
    const lastResponse = responses.at(-1);

    return {
      page: lastResponse?.page ?? 0,
      results: responses.flatMap(({ results }) => results),
      totalPages: lastResponse?.total_pages ?? 0,
      totalResults: lastResponse?.total_results ?? 0,
    };
  });

export const getPersonDetails = createServerFn({ method: 'GET' })
  .validator(v.object({ personId: IdSchema }))
  .handler(async ({ data: { personId } }) =>
    getTmdbApi().people.details({ person_id: personId, append_to_response: ['combined_credits'] }),
  );

export const getTrending = createServerFn({ method: 'GET' })
  .validator(
    v.object({
      media: TrendingMediaTypeSchema,
      page: PageSchema,
      timeWindow: v.picklist(['day', 'week']),
    }),
  )
  .handler(async ({ data: { media, page, timeWindow } }) => {
    const tmdbApi = getTmdbApi();
    const pagesToFetch = [page, page + 1, page + 2];
    const responses = await Promise.all(
      pagesToFetch.map((pageToFetch) => tmdbApi.trending[media]({ page: pageToFetch, time_window: timeWindow })),
    );
    const lastResponse = responses.at(-1);

    return {
      page: lastResponse?.page ?? 0,
      results: Array.from(
        new Map(
          responses.flatMap(({ results }) => results).map((result) => [`${result.media_type}-${result.id}`, result]),
        ).values(),
      ),
      totalPages: lastResponse?.total_pages ?? 0,
      totalResults: lastResponse?.total_results ?? 0,
    };
  });

const mapSearchResultsToOptions = (results: Array<{ id: number; name: string }>) =>
  results.map(({ id, name }) => ({ value: id.toString(), label: name }));

export const searchKeywords = createServerFn({ method: 'GET' })
  .validator(v.object({ query: QuerySchema }))
  .handler(async ({ data: { query } }) => {
    const { results } = await getTmdbApi().search.keyword({ query });
    return mapSearchResultsToOptions(results);
  });

export const searchCompanies = createServerFn({ method: 'GET' })
  .validator(v.object({ query: QuerySchema }))
  .handler(async ({ data: { query } }) => {
    const { results } = await getTmdbApi().search.company({ query });
    return mapSearchResultsToOptions(results);
  });

export const getSeasonDetails = createServerFn({ method: 'GET' })
  .validator(v.object({ seasonNumber: v.pipe(v.number(), v.integer(), v.minValue(0)), seriesId: IdSchema }))
  .handler(async ({ data: { seasonNumber, seriesId } }) =>
    getTmdbApi().tv_seasons.details({ season_number: seasonNumber, series_id: seriesId }),
  );
