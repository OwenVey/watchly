import { PersonCard } from '@/components/person-card';
import { Skeleton } from '@/components/ui/skeleton';
import { tmdbApi } from '@/lib/api';
import { infiniteQueryOptions, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import React from 'react';

export const Route = createFileRoute('/(people)/people')({
  loader: ({ context }) => context.queryClient.ensureInfiniteQueryData(peopleQueryOptions),
  component: People,
});

const peopleQueryOptions = infiniteQueryOptions({
  queryKey: ['people'],
  queryFn: async ({ pageParam }) => {
    const pagesToFetch = [pageParam, pageParam + 1, pageParam + 2];

    const responses = await Promise.all(pagesToFetch.map((page) => tmdbApi('/person/popular', { query: { page } })));

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

function People() {
  const [loadMoreRef, entry] = useIntersectionObserver();

  const { data: people, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(peopleQueryOptions);

  React.useEffect(() => {
    if (entry?.isIntersecting && !isFetchingNextPage && hasNextPage) {
      void fetchNextPage();
    }
  }, [entry, fetchNextPage, isFetchingNextPage, hasNextPage]);

  return (
    <ul className="grid w-full auto-rows-min grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 p-4">
      {people.pages.map(({ page, results }) => (
        <React.Fragment key={page}>
          {results.map((person) => (
            <li key={person.id}>
              <PersonCard name={person.name} profilePath={person.profile_path} />
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
    </ul>
  );
}
