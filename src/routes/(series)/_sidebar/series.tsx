import { SeriesCard } from '@/components/series-card';
import type { Option } from '@/components/ui/multiselect';
import { Skeleton } from '@/components/ui/skeleton';
import { tmdbApi } from '@/lib/api';
import { TvShowTypeSchema } from '@/schemas';
import type { TvShowType } from '@/types';
import { infiniteQueryOptions, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, retainSearchParams, stripSearchParams } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { format } from 'date-fns';
import React from 'react';
import { z } from 'zod';

export const DEFAULT_SERIES_SEARCH = {
  firstAirDateAfter: undefined,
  firstAirDateBefore: undefined,
  ratingMin: 0,
  ratingMax: 10,
  voteCountMin: 0,
  voteCountMax: 1_000,
  sort: 'popularity',
  sortDir: 'desc',
  genres: [] as number[],
  status: '',
  types: [] as TvShowType[],
  keywords: [] as Option[],
  studios: [] as Option[],
  originalLanguage: undefined,
  watchProviders: [] as number[],
  adult: false,
  query: '',
} as const;

const SeriesSearchSchema = z.object({
  firstAirDateAfter: z.string().optional().pipe(z.coerce.date().optional()),
  firstAirDateBefore: z.string().optional().pipe(z.coerce.date().optional()),
  ratingMin: fallback(
    z
      .number()
      .min(1)
      .max(DEFAULT_SERIES_SEARCH.ratingMax - 1),
    DEFAULT_SERIES_SEARCH.ratingMin,
  ).default(DEFAULT_SERIES_SEARCH.ratingMin),
  ratingMax: fallback(z.number().min(1).max(DEFAULT_SERIES_SEARCH.ratingMax), DEFAULT_SERIES_SEARCH.ratingMax).default(
    DEFAULT_SERIES_SEARCH.ratingMax,
  ),
  voteCountMin: fallback(
    z
      .number()
      .min(1)
      .max(DEFAULT_SERIES_SEARCH.voteCountMax - 1),
    DEFAULT_SERIES_SEARCH.voteCountMin,
  ).default(DEFAULT_SERIES_SEARCH.voteCountMin),
  voteCountMax: fallback(
    z.number().min(1).max(DEFAULT_SERIES_SEARCH.voteCountMax),
    DEFAULT_SERIES_SEARCH.voteCountMax,
  ).default(DEFAULT_SERIES_SEARCH.voteCountMax),
  sort: fallback(
    z.enum(['first_air_date', 'name', 'popularity', 'vote_average', 'vote_count']),
    DEFAULT_SERIES_SEARCH.sort,
  ).default(DEFAULT_SERIES_SEARCH.sort),
  sortDir: fallback(z.enum(['asc', 'desc']), DEFAULT_SERIES_SEARCH.sortDir).default(DEFAULT_SERIES_SEARCH.sortDir),
  genres: fallback(z.array(z.number()), DEFAULT_SERIES_SEARCH.genres).default(DEFAULT_SERIES_SEARCH.genres),
  status: fallback(z.string(), DEFAULT_SERIES_SEARCH.status).default(DEFAULT_SERIES_SEARCH.status),
  types: fallback(z.array(TvShowTypeSchema), DEFAULT_SERIES_SEARCH.types).default(DEFAULT_SERIES_SEARCH.types),
  keywords: fallback(
    z.array(z.object({ value: z.string(), label: z.string() })),
    DEFAULT_SERIES_SEARCH.keywords,
  ).default(DEFAULT_SERIES_SEARCH.keywords),
  studios: fallback(z.array(z.object({ value: z.string(), label: z.string() })), DEFAULT_SERIES_SEARCH.studios).default(
    DEFAULT_SERIES_SEARCH.studios,
  ),
  originalLanguage: z.string().optional(),
  watchProviders: fallback(z.array(z.number()), DEFAULT_SERIES_SEARCH.watchProviders).default(
    DEFAULT_SERIES_SEARCH.watchProviders,
  ),
  adult: fallback(z.boolean(), DEFAULT_SERIES_SEARCH.adult).default(DEFAULT_SERIES_SEARCH.adult),
});

export type SeriesSearchParams = z.infer<typeof SeriesSearchSchema>;

export const Route = createFileRoute('/(series)/_sidebar/series')({
  validateSearch: zodValidator(SeriesSearchSchema),
  search: {
    middlewares: [stripSearchParams(DEFAULT_SERIES_SEARCH), retainSearchParams(true)],
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) => queryClient.ensureInfiniteQueryData(seriesQueryOptions(deps)),
  pendingMs: 0,
  pendingComponent: SkeletonCards,
  component: SeriesCards,
});

const seriesQueryOptions = (params: SeriesSearchParams) =>
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

function SkeletonCards() {
  return Array.from({ length: 60 }).map((_, index) => (
    <Skeleton className="aspect-[2/3] w-full border border-gray-6" key={`placeholder-${index}`} />
  ));
}

function SeriesCards() {
  const deps = Route.useLoaderDeps();
  const [loadMoreRef, entry] = useIntersectionObserver();

  const {
    data: series,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(seriesQueryOptions(deps));

  React.useEffect(() => {
    if (entry?.isIntersecting && !isFetchingNextPage && hasNextPage) {
      void fetchNextPage();
    }
  }, [entry, fetchNextPage, isFetchingNextPage, hasNextPage]);

  if (series.pages[0]?.totalResults === 0) {
    return <div className="col-span-full mt-48 grid place-items-center text-gray-11">No results</div>;
  }

  return (
    <>
      {series.pages.map(({ page, results }) => (
        <React.Fragment key={page}>
          {results.map((show) => (
            <li key={show.id}>
              <SeriesCard series={show} />
            </li>
          ))}
        </React.Fragment>
      ))}

      {isFetchingNextPage &&
        Array.from({ length: 60 }).map((_, index) => (
          <li key={`placeholder-${index}`}>
            <Skeleton className="aspect-[2/3] w-full border border-gray-5" />
          </li>
        ))}

      <div ref={loadMoreRef} className="h-1" />
    </>
  );
}
