import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { format } from 'date-fns/format';
import type { SeriesSearchParams } from '@/routes/(series)/_sidebar/series';
import { tmdbApi } from '@/lib/api';
import { DEFAULT_MOVIE_SEARCH, DEFAULT_SERIES_SEARCH } from '@/lib/constants';
import { type MovieSearchParams } from '@/routes/(movies)/_sidebar/movies';

export const movieQueryOptions = (params: MovieSearchParams) =>
  infiniteQueryOptions({
    queryKey: ['movies', params],
    queryFn: async ({ pageParam }) => {
      const pagesToFetch = [pageParam, pageParam + 1, pageParam + 2];
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const responses = await Promise.all(
        pagesToFetch.map((page) =>
          tmdbApi('/discover/movie', {
            query: {
              page,
              ...(params.adult !== DEFAULT_MOVIE_SEARCH.adult && {
                include_adult: params.adult,
              }),
              ...(params.releasedAfter !== DEFAULT_MOVIE_SEARCH.releasedAfter && {
                'primary_release_date.gte': format(params.releasedAfter, 'yyyy-M-d'),
              }),
              ...(params.releasedBefore !== DEFAULT_MOVIE_SEARCH.releasedBefore && {
                'primary_release_date.lte': format(params.releasedBefore, 'yyyy-M-d'),
              }),
              ...(params.ratingMin !== DEFAULT_MOVIE_SEARCH.ratingMin && {
                'vote_average.gte': params.ratingMin,
              }),
              ...(params.ratingMax !== DEFAULT_MOVIE_SEARCH.ratingMax && {
                'vote_average.lte': params.ratingMax,
              }),
              ...(params.voteCountMin !== DEFAULT_MOVIE_SEARCH.voteCountMin && {
                'vote_count.gte': params.voteCountMin,
              }),
              ...(params.voteCountMax !== DEFAULT_MOVIE_SEARCH.voteCountMax && {
                'vote_count.lte': params.voteCountMax,
              }),
              ...(params.runtimeMin !== DEFAULT_MOVIE_SEARCH.runtimeMin && {
                'with_runtime.gte': params.runtimeMin,
              }),
              ...(params.runtimeMax !== DEFAULT_MOVIE_SEARCH.runtimeMax && {
                'with_runtime.lte': params.runtimeMax,
              }),
              ...((params.sort !== DEFAULT_MOVIE_SEARCH.sort || params.sortDir !== DEFAULT_MOVIE_SEARCH.sortDir) && {
                sort_by: `${params.sort}.${params.sortDir}`,
              }),
              ...(params.genres.length > 0 && {
                with_genres: params.genres.join(','),
              }),
              ...(params.releaseTypes.length > 0 && {
                with_release_type: params.releaseTypes.join('|'),
              }),
              ...(params.keywords.length > 0 && {
                with_keywords: params.keywords.map(({ value }) => value).join(','),
              }),
              ...(params.studios.length > 0 && {
                with_companies: params.studios.map(({ value }) => value).join(','),
              }),
              ...(params.originalLanguage && {
                with_original_language: params.originalLanguage,
              }),
              ...(params.watchProviders.length > 0 && {
                watch_region: 'US',
                with_watch_providers: params.watchProviders.join('|'),
              }),
            },
          }),
        ),
      );

      const lastResponse = responses.at(-1);
      return {
        page: lastResponse?.page ?? 0,
        results: Array.from(
          new Map(responses.flatMap(({ results }) => results.map((movie) => [movie.id, movie]))).values(), // remove duplicates
        ),
        totalPages: lastResponse?.total_pages ?? 0,
        totalResults: lastResponse?.total_results ?? 0,
      };
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
  });

export const seriesQueryOptions = (params: SeriesSearchParams) =>
  infiniteQueryOptions({
    queryKey: ['series', params],
    queryFn: async ({ pageParam }) => {
      const pagesToFetch = [pageParam, pageParam + 1, pageParam + 2];
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const responses = await Promise.all(
        pagesToFetch.map((page) =>
          tmdbApi('/discover/tv', {
            query: {
              page,
              ...(params.adult !== DEFAULT_SERIES_SEARCH.adult && {
                include_adult: params.adult,
              }),
              ...(params.firstAirDateAfter !== DEFAULT_SERIES_SEARCH.firstAirDateAfter && {
                'first_air_date.gte': format(params.firstAirDateAfter, 'yyyy-M-d'),
              }),
              ...(params.firstAirDateBefore !== DEFAULT_SERIES_SEARCH.firstAirDateBefore && {
                'primary_release_date.lte': format(params.firstAirDateBefore, 'yyyy-M-d'),
              }),
              ...(params.ratingMin !== DEFAULT_SERIES_SEARCH.ratingMin && {
                'vote_average.gte': params.ratingMin,
              }),
              ...(params.ratingMax !== DEFAULT_SERIES_SEARCH.ratingMax && {
                'vote_average.lte': params.ratingMax,
              }),
              ...(params.voteCountMin !== DEFAULT_SERIES_SEARCH.voteCountMin && {
                'vote_count.gte': params.voteCountMin,
              }),
              ...(params.voteCountMax !== DEFAULT_SERIES_SEARCH.voteCountMax && {
                'vote_count.lte': params.voteCountMax,
              }),
              ...((params.sort !== DEFAULT_SERIES_SEARCH.sort || params.sortDir !== DEFAULT_SERIES_SEARCH.sortDir) && {
                sort_by: `${params.sort}.${params.sortDir}`,
              }),
              ...(params.genres.length > 0 && {
                with_genres: params.genres.join(','),
              }),
              ...(params.status.length > 0 && {
                with_status: params.status,
              }),
              ...(params.types.length > 0 && {
                with_type: params.types.join('|'),
              }),
              ...(params.keywords.length > 0 && {
                with_keywords: params.keywords.map(({ value }) => value).join(','),
              }),
              ...(params.studios.length > 0 && {
                with_companies: params.studios.map(({ value }) => value).join(','),
              }),
              ...(params.networks.length > 0 && {
                with_networks: params.networks.map(({ value }) => value).join(','),
              }),
              ...(params.originalLanguage && {
                with_original_language: params.originalLanguage,
              }),
              ...(params.watchProviders.length > 0 && {
                watch_region: 'US',
                with_watch_providers: params.watchProviders.join('|'),
              }),
            },
          }),
        ),
      );

      const lastResponse = responses.at(-1);
      return {
        page: lastResponse?.page ?? 0,
        results: Array.from(
          new Map(responses.flatMap(({ results }) => results.map((series) => [series.id, series]))).values(), // remove duplicates
        ),
        totalPages: lastResponse?.total_pages ?? 0,
        totalResults: lastResponse?.total_results ?? 0,
      };
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
  });

export const seriesIdQueryOptions = (seriesId: string) =>
  queryOptions({
    queryKey: ['series', seriesId],
    queryFn: async () =>
      tmdbApi('/tv/:seriesId', {
        params: { seriesId },
        query: {
          append_to_response: [
            'recommendations',
            'similar',
            'reviews',
            'credits',
            'external_ids',
            'content_ratings',
            'keywords',
          ],
        },
      }),
  });

export const movieIdQueryOptions = (movieId: string) =>
  queryOptions({
    queryKey: ['movie', movieId],
    queryFn: async () =>
      tmdbApi('/movie/:movieId', {
        params: { movieId },
        query: {
          append_to_response: ['recommendations', 'similar', 'reviews', 'credits', 'release_dates', 'keywords'],
        },
      }),
  });

export const searchQueryOptions = (query: string) =>
  infiniteQueryOptions({
    queryKey: ['search', query],
    queryFn: async ({ pageParam: page }) => {
      const [movies, shows, people] = await Promise.all([
        tmdbApi('/search/movie', { query: { query, page } }),
        tmdbApi('/search/tv', { query: { query, page } }),
        tmdbApi('/search/person', { query: { query, page } }),
      ]);

      return {
        results: [...movies.results, ...shows.results, ...people.results].sort(
          (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0),
        ),
        page,
        total_pages: Math.max(movies.total_pages, shows.total_pages, people.total_pages),
        total_results: Math.max(movies.total_results, shows.total_results, people.total_results),
      };
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
  });

export const peopleQueryOptions = infiniteQueryOptions({
  queryKey: ['people'],
  queryFn: async ({ pageParam }) => {
    const pagesToFetch = [pageParam, pageParam + 1, pageParam + 2];

    const responses = await Promise.all(pagesToFetch.map((page) => tmdbApi('/person/popular', { query: { page } })));

    const lastResponse = responses.at(-1);
    return {
      page: lastResponse?.page ?? 0,
      results: responses.flatMap(({ results }) => results),
      totalPages: lastResponse?.total_pages ?? 0,
      totalResults: lastResponse?.total_results ?? 0,
    };
  },
  initialPageParam: 1,
  getPreviousPageParam: (firstPage) => firstPage.page - 1,
  getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
});

export const personIdQueryOptions = (personId: string) =>
  queryOptions({
    queryKey: ['person', personId],
    queryFn: async () =>
      tmdbApi('/person/:personId', {
        params: { personId },
        query: {
          append_to_response: ['combined_credits'],
        },
      }),
  });
