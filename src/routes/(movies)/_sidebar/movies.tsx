import { MovieReleaseType } from '@lorenzopant/tmdb';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, retainSearchParams, stripSearchParams } from '@tanstack/react-router';
import React from 'react';
import * as v from 'valibot';
import { MovieCard } from '@/components/movie-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { DEFAULT_MOVIE_SEARCH, LANGUAGES_MAP } from '@/lib/constants';
import { schemaObjectKeys } from '@/lib/utils';
import { movieQueryOptions } from '@/query-options';

const MovieSearchSchema = v.object({
  releasedAfter: v.optional(v.pipe(v.string(), v.isoTimestamp())),
  releasedBefore: v.optional(v.pipe(v.string(), v.isoTimestamp())),
  ratingMin: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_MOVIE_SEARCH.ratingMax - 1)),
      DEFAULT_MOVIE_SEARCH.ratingMin,
    ),
    DEFAULT_MOVIE_SEARCH.ratingMin,
  ),
  ratingMax: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_MOVIE_SEARCH.ratingMax)),
      DEFAULT_MOVIE_SEARCH.ratingMax,
    ),
    DEFAULT_MOVIE_SEARCH.ratingMax,
  ),
  voteCountMin: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_MOVIE_SEARCH.voteCountMax - 1)),
      DEFAULT_MOVIE_SEARCH.voteCountMin,
    ),
    DEFAULT_MOVIE_SEARCH.voteCountMin,
  ),
  voteCountMax: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_MOVIE_SEARCH.voteCountMax)),
      DEFAULT_MOVIE_SEARCH.voteCountMax,
    ),
    DEFAULT_MOVIE_SEARCH.voteCountMax,
  ),
  runtimeMin: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_MOVIE_SEARCH.runtimeMax - 1)),
      DEFAULT_MOVIE_SEARCH.runtimeMin,
    ),
    DEFAULT_MOVIE_SEARCH.runtimeMin,
  ),
  runtimeMax: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_MOVIE_SEARCH.runtimeMax)),
      DEFAULT_MOVIE_SEARCH.runtimeMax,
    ),
    DEFAULT_MOVIE_SEARCH.runtimeMax,
  ),
  sort: v.optional(
    v.fallback(
      v.picklist(['vote_average', 'primary_release_date', 'revenue', 'popularity', 'title', 'vote_count']),
      DEFAULT_MOVIE_SEARCH.sort,
    ),
    DEFAULT_MOVIE_SEARCH.sort,
  ),
  sortDir: v.optional(
    v.fallback(v.picklist(['asc', 'desc']), DEFAULT_MOVIE_SEARCH.sortDir),
    DEFAULT_MOVIE_SEARCH.sortDir,
  ),
  genres: v.optional(v.fallback(v.array(v.number()), DEFAULT_MOVIE_SEARCH.genres), DEFAULT_MOVIE_SEARCH.genres),
  releaseTypes: v.optional(
    v.fallback(v.array(v.picklist(Object.values(MovieReleaseType))), DEFAULT_MOVIE_SEARCH.releaseTypes),
    DEFAULT_MOVIE_SEARCH.releaseTypes,
  ),
  keywords: v.optional(
    v.fallback(v.array(v.object({ value: v.string(), label: v.string() })), DEFAULT_MOVIE_SEARCH.keywords),
    DEFAULT_MOVIE_SEARCH.keywords,
  ),
  studios: v.optional(
    v.fallback(v.array(v.object({ value: v.string(), label: v.string() })), DEFAULT_MOVIE_SEARCH.studios),
    DEFAULT_MOVIE_SEARCH.studios,
  ),
  originalLanguage: v.optional(schemaObjectKeys(LANGUAGES_MAP)),
  watchProviders: v.optional(
    v.fallback(v.array(v.number()), DEFAULT_MOVIE_SEARCH.watchProviders),
    DEFAULT_MOVIE_SEARCH.watchProviders,
  ),
  adult: v.optional(v.fallback(v.boolean(), DEFAULT_MOVIE_SEARCH.adult), DEFAULT_MOVIE_SEARCH.adult),
});
export type MovieSearchParams = v.InferOutput<typeof MovieSearchSchema>;

export const Route = createFileRoute('/(movies)/_sidebar/movies')({
  validateSearch: MovieSearchSchema,
  search: {
    middlewares: [
      retainSearchParams(Object.keys(DEFAULT_MOVIE_SEARCH) as Array<keyof typeof DEFAULT_MOVIE_SEARCH>),
      stripSearchParams(DEFAULT_MOVIE_SEARCH),
    ],
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureInfiniteQueryData(movieQueryOptions(deps)),
  pendingMs: 0,
  pendingComponent: SkeletonCards,
  component: MovieCards,
});

function SkeletonCards() {
  return Array.from({ length: 60 }).map((_, index) => (
    <Skeleton className="aspect-2/3 w-full border" key={`placeholder-${index}`} />
  ));
}

function MovieCards() {
  const deps = Route.useLoaderDeps();

  const { ref: loadMoreRef } = useIntersectionObserver({
    onChange: (isIntersecting) => isIntersecting && hasNextPage && fetchNextPage(),
  });

  const {
    data: movies,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(movieQueryOptions(deps));

  if (movies.pages[0]?.totalResults === 0) {
    return <div className="col-span-full mt-48 grid place-items-center text-muted-foreground">No results</div>;
  }

  return (
    <>
      {movies.pages.map(({ page, results }) => (
        <React.Fragment key={page}>
          {results.map((movie) => (
            <li key={movie.id}>
              <MovieCard movie={movie} />
            </li>
          ))}
        </React.Fragment>
      ))}

      {isFetchingNextPage ? (
        Array.from({ length: 60 }).map((_, index) => (
          <li key={`placeholder-${index}`}>
            <Skeleton className="aspect-2/3 w-full border" />
          </li>
        ))
      ) : (
        <div ref={loadMoreRef} className="h-1" />
      )}
    </>
  );
}
