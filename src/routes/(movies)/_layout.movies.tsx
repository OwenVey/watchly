import { MovieCard } from '@/components/movie-card';
import type { Option } from '@/components/multi-select';
import {} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { tmdbApi } from '@/lib/api';
import {} from '@/lib/constants';
import { ReleaseTypeSchema } from '@/schemas';
import type { ReleaseType } from '@/types';
import { infiniteQueryOptions, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, retainSearchParams, stripSearchParams } from '@tanstack/react-router';
import { fallback, zodSearchValidator } from '@tanstack/router-zod-adapter';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { format } from 'date-fns';
import React from 'react';
import { z } from 'zod';

export const DEFAULT_MOVIE_SEARCH = {
  releasedAfter: undefined,
  releasedBefore: undefined,
  ratingMin: 0,
  ratingMax: 10,
  voteCountMin: 0,
  voteCountMax: 50_000,
  runtimeMin: 0,
  runtimeMax: 300,
  sort: 'popularity',
  sortDir: 'desc',
  genres: [] as number[],
  releaseTypes: [] as ReleaseType[],
  keywords: [] as Option[],
  studios: [] as Option[],
  originalLanguage: undefined,
  watchProviders: [] as number[],
  adult: false,
} as const;

const MovieSearchSchema = z.object({
  releasedAfter: z.string().optional().pipe(z.coerce.date().optional()),
  releasedBefore: z.string().optional().pipe(z.coerce.date().optional()),
  ratingMin: fallback(
    z
      .number()
      .min(1)
      .max(DEFAULT_MOVIE_SEARCH.ratingMax - 1),
    DEFAULT_MOVIE_SEARCH.ratingMin,
  ).default(DEFAULT_MOVIE_SEARCH.ratingMin),
  ratingMax: fallback(z.number().min(1).max(DEFAULT_MOVIE_SEARCH.ratingMax), DEFAULT_MOVIE_SEARCH.ratingMax).default(
    DEFAULT_MOVIE_SEARCH.ratingMax,
  ),
  voteCountMin: fallback(
    z
      .number()
      .min(1)
      .max(DEFAULT_MOVIE_SEARCH.voteCountMax - 1),
    DEFAULT_MOVIE_SEARCH.voteCountMin,
  ).default(DEFAULT_MOVIE_SEARCH.voteCountMin),
  voteCountMax: fallback(
    z.number().min(1).max(DEFAULT_MOVIE_SEARCH.voteCountMax),
    DEFAULT_MOVIE_SEARCH.voteCountMax,
  ).default(DEFAULT_MOVIE_SEARCH.voteCountMax),
  runtimeMin: fallback(
    z
      .number()
      .min(1)
      .max(DEFAULT_MOVIE_SEARCH.runtimeMax - 1),
    DEFAULT_MOVIE_SEARCH.runtimeMin,
  ).default(DEFAULT_MOVIE_SEARCH.runtimeMin),
  runtimeMax: fallback(z.number().min(1).max(DEFAULT_MOVIE_SEARCH.runtimeMax), DEFAULT_MOVIE_SEARCH.runtimeMax).default(
    DEFAULT_MOVIE_SEARCH.runtimeMax,
  ),
  sort: fallback(
    z.enum(['vote_average', 'primary_release_date', 'revenue', 'popularity', 'title', 'vote_count']),
    DEFAULT_MOVIE_SEARCH.sort,
  ).default(DEFAULT_MOVIE_SEARCH.sort),
  sortDir: fallback(z.enum(['asc', 'desc']), DEFAULT_MOVIE_SEARCH.sortDir).default(DEFAULT_MOVIE_SEARCH.sortDir),
  genres: fallback(z.array(z.number()), DEFAULT_MOVIE_SEARCH.genres).default(DEFAULT_MOVIE_SEARCH.genres),
  releaseTypes: fallback(z.array(ReleaseTypeSchema), DEFAULT_MOVIE_SEARCH.releaseTypes).default(
    DEFAULT_MOVIE_SEARCH.releaseTypes,
  ),
  keywords: fallback(
    z.array(z.object({ value: z.string(), label: z.string() })),
    DEFAULT_MOVIE_SEARCH.keywords,
  ).default(DEFAULT_MOVIE_SEARCH.keywords),
  studios: fallback(z.array(z.object({ value: z.string(), label: z.string() })), DEFAULT_MOVIE_SEARCH.studios).default(
    DEFAULT_MOVIE_SEARCH.studios,
  ),
  originalLanguage: z.string().optional(),
  watchProviders: fallback(z.array(z.number()), DEFAULT_MOVIE_SEARCH.watchProviders).default(
    DEFAULT_MOVIE_SEARCH.watchProviders,
  ),
  adult: fallback(z.boolean(), DEFAULT_MOVIE_SEARCH.adult).default(DEFAULT_MOVIE_SEARCH.adult),
});

export type MovieSearchParams = z.infer<typeof MovieSearchSchema>;

const movieQueryOptions = (params: MovieSearchParams) =>
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
              ...(params.adult !== DEFAULT_MOVIE_SEARCH.adult && {
                include_adult: params.adult,
              }),
            },
          }),
        ),
      );

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

export const Route = createFileRoute('/(movies)/_layout/movies')({
  validateSearch: zodSearchValidator(MovieSearchSchema),
  search: {
    middlewares: [stripSearchParams(DEFAULT_MOVIE_SEARCH), retainSearchParams(true)],
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) => queryClient.ensureInfiniteQueryData(movieQueryOptions(deps)),
  pendingMs: 0,
  pendingComponent: SkeletonCards,
  component: MovieCards,
});

function SkeletonCards() {
  return Array.from({ length: 60 }).map((_, index) => (
    <Skeleton className="aspect-[2/3] w-full border border-gray-6" key={`placeholder-${index}`} />
  ));
}

function MovieCards() {
  const deps = Route.useLoaderDeps();
  const [loadMoreRef, entry] = useIntersectionObserver();

  const {
    data: movies,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(movieQueryOptions(deps));

  React.useEffect(() => {
    if (entry?.isIntersecting && !isFetchingNextPage && hasNextPage) {
      void fetchNextPage();
    }
  }, [entry, fetchNextPage, isFetchingNextPage, hasNextPage]);

  if (movies.pages[0]?.totalResults === 0) {
    return <div className="col-span-full mt-48 grid place-items-center text-gray-11">No results</div>;
  }

  return (
    <>
      {movies.pages.map((page) => (
        <React.Fragment key={page.page}>
          {page.results.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </React.Fragment>
      ))}

      {isFetchingNextPage &&
        Array.from({ length: 60 }).map((_, index) => (
          <Skeleton className="aspect-[2/3] w-full border border-gray-5" key={`placeholder-${index}`} />
        ))}

      <div ref={loadMoreRef} className="h-1" />
    </>
  );
}
