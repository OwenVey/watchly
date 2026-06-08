import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import React from 'react';
import { PersonCard } from '@/components/person-card';
import { FullPageGridPending } from '@/components/route-pending';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { peopleQueryOptions } from '@/query-options';

export const Route = createFileRoute('/(people)/people')({
  loader: ({ context }) => context.queryClient.ensureInfiniteQueryData(peopleQueryOptions),
  pendingMs: 0,
  pendingComponent: FullPageGridPending,
  component: People,
});

function People() {
  const { data: people, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(peopleQueryOptions);

  const { ref: loadMoreRef } = useIntersectionObserver({
    onChange: (isIntersecting) => isIntersecting && !isFetchingNextPage && hasNextPage && void fetchNextPage(),
  });

  return (
    <ul className="grid w-full auto-rows-min grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 p-4">
      {people.pages.map(({ page, results }) => (
        <React.Fragment key={page}>
          {results.map((person) => (
            <li key={person.id}>
              <PersonCard person={person} />
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
    </ul>
  );
}
