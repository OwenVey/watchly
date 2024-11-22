import { MovieCard } from '@/components/movie-card';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_MOVIE_SEARCH } from '@/lib/constants';
import { movieQueryOptions } from '@/query-options';
import { MovieReleaseTypeSchema } from '@/schemas';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, retainSearchParams, stripSearchParams } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import React from 'react';
import { z } from 'zod';

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
  releaseTypes: fallback(z.array(MovieReleaseTypeSchema), DEFAULT_MOVIE_SEARCH.releaseTypes).default(
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

export const Route = createFileRoute('/(movies)/_sidebar/movies')({
  validateSearch: zodValidator(MovieSearchSchema),
  search: {
    middlewares: [
      stripSearchParams(DEFAULT_MOVIE_SEARCH),
      // retainSearchParams(Object.keys(DEFAULT_MOVIE_SEARCH) as Array<keyof typeof DEFAULT_MOVIE_SEARCH>),
      retainSearchParams(true),
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
      {movies.pages.map(({ page, results }) => (
        <React.Fragment key={page}>
          {results.map((movie) => (
            <li key={movie.id}>
              <MovieCard movie={movie} />
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
