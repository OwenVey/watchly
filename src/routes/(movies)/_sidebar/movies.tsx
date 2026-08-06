import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, retainSearchParams, stripSearchParams } from '@tanstack/react-router';
import React from 'react';
import { MovieCard } from '@/components/movie-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { DEFAULT_CARD_VIEW, DEFAULT_MOVIE_SEARCH } from '@/lib/constants';
import { movieQueryOptions } from '@/query-options';
import { MovieSearchSchema } from '@/schemas';

export const Route = createFileRoute('/(movies)/_sidebar/movies')({
  validateSearch: MovieSearchSchema,
  search: {
    middlewares: [
      retainSearchParams([
        ...(Object.keys(DEFAULT_MOVIE_SEARCH) as Array<keyof typeof DEFAULT_MOVIE_SEARCH>),
        ...(Object.keys(DEFAULT_CARD_VIEW) as Array<keyof typeof DEFAULT_CARD_VIEW>),
      ]),
      stripSearchParams({ ...DEFAULT_MOVIE_SEARCH, ...DEFAULT_CARD_VIEW }),
    ],
  },
  loaderDeps: ({
    search: { cardSize: _cardSize, showNames: _showNames, showRatings: _showRatings, showYears: _showYears, ...params },
  }) => params,
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
  const { showNames, showRatings, showYears } = Route.useSearch();

  const {
    data: movies,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(movieQueryOptions(deps));

  const { ref: loadMoreRef } = useIntersectionObserver({
    onChange: (isIntersecting) => isIntersecting && !isFetchingNextPage && hasNextPage && void fetchNextPage(),
  });

  if (movies.pages[0]?.totalResults === 0) {
    return <div className="col-span-full mt-48 grid place-items-center text-muted-foreground">No results</div>;
  }

  return (
    <>
      {movies.pages.map(({ page, results }) => (
        <React.Fragment key={page}>
          {results.map((movie) => (
            <li key={movie.id}>
              <MovieCard movie={movie} showName={showNames} showRating={showRatings} showYear={showYears} />
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
