import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, retainSearchParams, stripSearchParams } from '@tanstack/react-router';
import React from 'react';
import { SeriesCard } from '@/components/series-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { DEFAULT_CARD_VIEW, DEFAULT_SERIES_SEARCH } from '@/lib/constants';
import { seriesQueryOptions } from '@/query-options';
import { SeriesSearchSchema } from '@/schemas';

export const Route = createFileRoute('/(series)/_sidebar/series')({
  validateSearch: SeriesSearchSchema,
  search: {
    middlewares: [
      retainSearchParams([
        ...(Object.keys(DEFAULT_SERIES_SEARCH) as Array<keyof typeof DEFAULT_SERIES_SEARCH>),
        ...(Object.keys(DEFAULT_CARD_VIEW) as Array<keyof typeof DEFAULT_CARD_VIEW>),
      ]),
      stripSearchParams({ ...DEFAULT_SERIES_SEARCH, ...DEFAULT_CARD_VIEW }),
    ],
  },

  loaderDeps: ({
    search: { cardSize: _cardSize, showNames: _showNames, showRatings: _showRatings, showYears: _showYears, ...params },
  }) => params,
  loader: ({ context, deps }) => context.queryClient.ensureInfiniteQueryData(seriesQueryOptions(deps)),
  pendingMs: 0,
  pendingComponent: SkeletonCards,
  component: SeriesCards,
});

function SkeletonCards() {
  return Array.from({ length: 60 }).map((_, index) => (
    <Skeleton className="aspect-2/3 w-full border" key={`placeholder-${index}`} />
  ));
}

function SeriesCards() {
  const deps = Route.useLoaderDeps();
  const { showNames, showRatings, showYears } = Route.useSearch();

  const {
    data: series,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(seriesQueryOptions(deps));

  const { ref: loadMoreRef } = useIntersectionObserver({
    onChange: (isIntersecting) => isIntersecting && !isFetchingNextPage && hasNextPage && void fetchNextPage(),
  });

  if (series.pages[0]?.totalResults === 0) {
    return <div className="col-span-full mt-48 grid place-items-center text-muted-foreground">No results</div>;
  }

  return (
    <>
      {series.pages.map(({ page, results }) => (
        <React.Fragment key={page}>
          {results.map((show) => (
            <li key={show.id}>
              <SeriesCard series={show} showName={showNames} showRating={showRatings} showYear={showYears} />
            </li>
          ))}
        </React.Fragment>
      ))}

      {isFetchingNextPage &&
        Array.from({ length: 60 }).map((_, index) => (
          <li key={`placeholder-${index}`}>
            <Skeleton className="aspect-2/3 w-full border" />
          </li>
        ))}

      <div ref={loadMoreRef} className="h-1" />
    </>
  );
}
