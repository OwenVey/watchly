import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import React from 'react';
import { z } from 'zod';
import { MovieCard } from '@/components/movie-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { DEFAULT_MOVIE_SEARCH } from '@/lib/constants';
import { movieQueryOptions } from '@/query-options';
import { MovieReleaseTypeSchema } from '@/schemas';

const MovieSearchSchema = z.object({
  releasedAfter: z.coerce.date().optional().catch(DEFAULT_MOVIE_SEARCH.releasedAfter),
  releasedBefore: z.coerce.date().optional().catch(DEFAULT_MOVIE_SEARCH.releasedBefore),
  ratingMin: z
    .number()
    .min(1)
    .max(DEFAULT_MOVIE_SEARCH.ratingMax - 1)
    .default(DEFAULT_MOVIE_SEARCH.ratingMin)
    .catch(DEFAULT_MOVIE_SEARCH.ratingMin),
  ratingMax: z
    .number()
    .min(1)
    .max(DEFAULT_MOVIE_SEARCH.ratingMax)
    .default(DEFAULT_MOVIE_SEARCH.ratingMax)
    .catch(DEFAULT_MOVIE_SEARCH.ratingMax),
  voteCountMin: z
    .number()
    .min(1)
    .max(DEFAULT_MOVIE_SEARCH.voteCountMax - 1)
    .default(DEFAULT_MOVIE_SEARCH.voteCountMin)
    .catch(DEFAULT_MOVIE_SEARCH.voteCountMin),
  voteCountMax: z
    .number()
    .min(1)
    .max(DEFAULT_MOVIE_SEARCH.voteCountMax)
    .default(DEFAULT_MOVIE_SEARCH.voteCountMax)
    .catch(DEFAULT_MOVIE_SEARCH.voteCountMax),
  runtimeMin: z
    .number()
    .min(1)
    .max(DEFAULT_MOVIE_SEARCH.runtimeMax - 1)
    .default(DEFAULT_MOVIE_SEARCH.runtimeMin)
    .catch(DEFAULT_MOVIE_SEARCH.runtimeMin),
  runtimeMax: z
    .number()
    .min(1)
    .max(DEFAULT_MOVIE_SEARCH.runtimeMax)
    .default(DEFAULT_MOVIE_SEARCH.runtimeMax)
    .catch(DEFAULT_MOVIE_SEARCH.runtimeMax),
  sort: z
    .enum(['vote_average', 'primary_release_date', 'revenue', 'popularity', 'title', 'vote_count'])
    .default(DEFAULT_MOVIE_SEARCH.sort)
    .catch(DEFAULT_MOVIE_SEARCH.sort),
  sortDir: z.enum(['asc', 'desc']).default(DEFAULT_MOVIE_SEARCH.sortDir).catch(DEFAULT_MOVIE_SEARCH.sortDir),
  genres: z.array(z.number()).default(DEFAULT_MOVIE_SEARCH.genres).catch(DEFAULT_MOVIE_SEARCH.genres),
  releaseTypes: z
    .array(MovieReleaseTypeSchema)
    .default(DEFAULT_MOVIE_SEARCH.releaseTypes)
    .catch(DEFAULT_MOVIE_SEARCH.releaseTypes),
  keywords: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .default(DEFAULT_MOVIE_SEARCH.keywords)
    .catch(DEFAULT_MOVIE_SEARCH.keywords),
  studios: z
    .array(z.object({ value: z.string(), label: z.string() }))
    .default(DEFAULT_MOVIE_SEARCH.studios)
    .catch(DEFAULT_MOVIE_SEARCH.studios),
  originalLanguage: z.string().optional().catch(DEFAULT_MOVIE_SEARCH.originalLanguage),
  watchProviders: z
    .array(z.number())
    .default(DEFAULT_MOVIE_SEARCH.watchProviders)
    .catch(DEFAULT_MOVIE_SEARCH.watchProviders),
  adult: z.boolean().optional().catch(DEFAULT_MOVIE_SEARCH.adult),
});
export type MovieSearchParams = z.infer<typeof MovieSearchSchema>;

export const Route = createFileRoute('/(movies)/_sidebar/movies')({
  validateSearch: MovieSearchSchema,
  search: {
    middlewares: [
      // retainSearchParams(true),
      // retainSearchParams(Object.keys({ ...DEFAULT_MOVIE_SEARCH }) as Array<keyof typeof DEFAULT_MOVIE_SEARCH>),
      stripSearchParams({ ...DEFAULT_MOVIE_SEARCH }),
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
