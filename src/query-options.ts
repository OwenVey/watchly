import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import {
  getCollectionDetails,
  getMovieDetails,
  getMovies,
  getMovieWatchProviders,
  getOmdbRatings,
  getPersonDetails,
  getPopularPeople,
  getSeries,
  getSeriesDetails,
  getSeriesWatchProviders,
  getTrending,
  searchMedia,
} from '@/lib/api.functions';
import { OMDB_ENABLED } from '@/lib/constants';
import type { MovieSearchParams, SeriesSearchParams } from '@/schemas';
import type { TrendingMediaType } from '@/types';

type ViewParam = 'cardSize' | 'showNames' | 'showRatings' | 'showYears';
type QueryOptionsParams<T> = Omit<T, ViewParam>;

export const movieQueryOptions = (params: QueryOptionsParams<MovieSearchParams>) =>
  infiniteQueryOptions({
    queryKey: ['movies', params],
    queryFn: ({ pageParam }) => getMovies({ data: { page: pageParam, params } }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
  });

export const seriesQueryOptions = (params: QueryOptionsParams<SeriesSearchParams>) =>
  infiniteQueryOptions({
    queryKey: ['series', params],
    queryFn: ({ pageParam }) => getSeries({ data: { page: pageParam, params } }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
  });

export const seriesIdQueryOptions = (seriesId: number) =>
  queryOptions({
    queryKey: ['series', seriesId],
    queryFn: () => getSeriesDetails({ data: { seriesId } }),
  });

export const movieIdQueryOptions = (movieId: number) =>
  queryOptions({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetails({ data: { movieId } }),
  });

export const collectionIdQueryOptions = (collectionId: number) =>
  queryOptions({
    queryKey: ['collection', collectionId],
    queryFn: () => getCollectionDetails({ data: { collectionId } }),
  });

export const omdbQueryOptions = (imdbId?: string) =>
  queryOptions({
    queryKey: ['omdb', imdbId ?? null],
    queryFn: () => (OMDB_ENABLED && imdbId ? getOmdbRatings({ data: { imdbId } }) : null),
    enabled: OMDB_ENABLED && Boolean(imdbId),
  });

export const movieWatchProvidersQueryOptions = queryOptions({
  queryKey: ['watch-providers', 'movie'],
  queryFn: () => getMovieWatchProviders(),
});

export const seriesWatchProvidersQueryOptions = queryOptions({
  queryKey: ['watch-providers', 'series'],
  queryFn: () => getSeriesWatchProviders(),
});

export const searchQueryOptions = (query: string) =>
  infiniteQueryOptions({
    queryKey: ['search', query],
    queryFn: ({ pageParam: page }) =>
      query.length === 0
        ? { page, results: [], total_pages: 0, total_results: 0 }
        : searchMedia({ data: { query, page } }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
  });

export const peopleQueryOptions = infiniteQueryOptions({
  queryKey: ['people'],
  queryFn: ({ pageParam }) => getPopularPeople({ data: { page: pageParam } }),
  initialPageParam: 1,
  getPreviousPageParam: (firstPage) => firstPage.page - 1,
  getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
});

export const personIdQueryOptions = (personId: number) =>
  queryOptions({
    queryKey: ['person', personId],
    queryFn: () => getPersonDetails({ data: { personId } }),
  });

export const trendingQueryOptions = ({ media, timeWindow }: { media: TrendingMediaType; timeWindow: 'day' | 'week' }) =>
  infiniteQueryOptions({
    queryKey: ['trending', { media, timeWindow }],
    queryFn: ({ pageParam }) => getTrending({ data: { media, page: pageParam, timeWindow } }),
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
  });
