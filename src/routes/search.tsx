import { MovieCard } from '@/components/movie-card';
import { PersonCard } from '@/components/person-card';
import { SeriesCard } from '@/components/series-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { tmdbApi } from '@/lib/api';
import { infiniteQueryOptions, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { fallback, zodSearchValidator } from '@tanstack/router-zod-adapter';
import React from 'react';
import { z } from 'zod';

export const Route = createFileRoute('/search')({
  validateSearch: zodSearchValidator(
    z.object({
      query: fallback(z.string(), '').default(''),
    }),
  ),
  search: {
    middlewares: [stripSearchParams({ query: '' })],
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureInfiniteQueryData(searchQueryOptions(deps.query)),
  pendingMs: 0,
  pendingComponent: () => (
    <div className="w-full">
      <h1 className="mt-4 px-4 text-2xl font-semibold text-gray-12">Search Results</h1>
      <ul className="grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 p-4">
        {Array.from({ length: 60 }).map((_, index) => (
          <Skeleton className="aspect-[2/3] w-full border border-gray-6" key={`placeholder-${index}`} />
        ))}
      </ul>
    </div>
  ),
  component: Search,
});

const searchQueryOptions = (query: string) =>
  infiniteQueryOptions({
    queryKey: ['search', query],
    queryFn: async ({ pageParam: page }) => {
      const [movies, shows, people] = await Promise.all([
        tmdbApi('/search/movie', { query: { query, page } }),
        tmdbApi('/search/tv', { query: { query, page } }),
        tmdbApi('/search/person', { query: { query, page } }),
      ]);

      return {
        results: [...movies.results, ...shows.results, ...people.results].sort((a, b) => b.popularity - a.popularity),
        page,
        total_pages: Math.max(movies.total_pages, shows.total_pages, people.total_pages),
        total_results: Math.max(movies.total_results, shows.total_results, people.total_results),
      };
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined),
  });

function Search() {
  const { query } = Route.useSearch();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(searchQueryOptions(query));

  if (query.length === 0) {
    return <div className="mt-48 grid w-full place-items-center text-gray-11">Search in the input above</div>;
  }

  if (data.pages[0]?.total_results === 0) {
    return <div className="mt-48 grid w-full place-items-center text-gray-11">No results for &quot;{query}&quot;</div>;
  }

  return (
    <div className="w-full">
      <h1 className="mt-4 px-4 text-2xl font-semibold text-gray-12">Search Results</h1>
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
        <Button variant="glass" onClick={() => fetchNextPage()} loading={isFetchingNextPage} disabled={!hasNextPage}>
          Load More
        </Button>
      </div>
    </div>
  );
}
