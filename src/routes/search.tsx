import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import React from 'react';
import * as v from 'valibot';
import { MovieCard } from '@/components/movie-card';
import { PersonCard } from '@/components/person-card';
import { SeriesCard } from '@/components/series-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { searchQueryOptions } from '@/query-options';

export const Route = createFileRoute('/search')({
  validateSearch: v.object({
    query: v.fallback(v.string(), ''),
  }),
  search: {
    middlewares: [stripSearchParams({ query: '' })],
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureInfiniteQueryData(searchQueryOptions(deps.query)),
  pendingMs: 0,
  pendingComponent: () => (
    <div className="w-full">
      <h1 className="mt-4 px-4 text-2xl font-semibold text-foreground">Search Results</h1>
      <ul className="grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 p-4">
        {Array.from({ length: 60 }).map((_, index) => (
          <Skeleton className="aspect-2/3 w-full border" key={`placeholder-${index}`} />
        ))}
      </ul>
    </div>
  ),
  component: Search,
});

function Search() {
  const { query } = Route.useSearch();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(searchQueryOptions(query));

  if (query.length === 0) {
    return <div className="mt-48 grid w-full place-items-center text-muted-foreground">Search in the input above</div>;
  }

  if (data.pages[0]?.total_results === 0) {
    return (
      <div className="mt-48 grid w-full place-items-center text-muted-foreground">
        No results for &quot;{query}&quot;
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="mt-4 px-4 text-2xl font-semibold text-foreground">Search Results</h1>
      <ul className="grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 p-4">
        {data.pages.map(({ page, results }) => (
          <React.Fragment key={page}>
            {results.map((result) => (
              <li key={result.id}>
                {result.media_type === 'movie' && <MovieCard movie={result} showBadge />}
                {result.media_type === 'tv' && <SeriesCard series={result} showBadge />}
                {result.media_type === 'person' && <PersonCard person={result} title={result.known_for_department} />}
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
      <div className="mb-4 flex justify-center">
        <Button variant="outline" onClick={() => fetchNextPage()} loading={isFetchingNextPage} disabled={!hasNextPage}>
          Load More
        </Button>
      </div>
    </div>
  );
}
