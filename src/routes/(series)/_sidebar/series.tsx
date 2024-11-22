import { SeriesCard } from '@/components/series-card';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_SERIES_SEARCH } from '@/lib/constants';
import { seriesQueryOptions } from '@/query-options';
import { OptionsSchema, TvShowTypeSchema } from '@/schemas';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, retainSearchParams, stripSearchParams } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import React from 'react';
import { z } from 'zod';

const SeriesSearchSchema = z.object({
  firstAirDateAfter: z.string().optional().pipe(z.coerce.date().optional()),
  firstAirDateBefore: z.string().optional().pipe(z.coerce.date().optional()),
  ratingMin: fallback(
    z
      .number()
      .min(1)
      .max(DEFAULT_SERIES_SEARCH.ratingMax - 1),
    DEFAULT_SERIES_SEARCH.ratingMin,
  ).default(DEFAULT_SERIES_SEARCH.ratingMin),
  ratingMax: fallback(z.number().min(1).max(DEFAULT_SERIES_SEARCH.ratingMax), DEFAULT_SERIES_SEARCH.ratingMax).default(
    DEFAULT_SERIES_SEARCH.ratingMax,
  ),
  voteCountMin: fallback(
    z
      .number()
      .min(1)
      .max(DEFAULT_SERIES_SEARCH.voteCountMax - 1),
    DEFAULT_SERIES_SEARCH.voteCountMin,
  ).default(DEFAULT_SERIES_SEARCH.voteCountMin),
  voteCountMax: fallback(
    z.number().min(1).max(DEFAULT_SERIES_SEARCH.voteCountMax),
    DEFAULT_SERIES_SEARCH.voteCountMax,
  ).default(DEFAULT_SERIES_SEARCH.voteCountMax),
  sort: fallback(
    z.enum(['first_air_date', 'name', 'popularity', 'vote_average', 'vote_count']),
    DEFAULT_SERIES_SEARCH.sort,
  ).default(DEFAULT_SERIES_SEARCH.sort),
  sortDir: fallback(z.enum(['asc', 'desc']), DEFAULT_SERIES_SEARCH.sortDir).default(DEFAULT_SERIES_SEARCH.sortDir),
  genres: fallback(z.array(z.number()), DEFAULT_SERIES_SEARCH.genres).default(DEFAULT_SERIES_SEARCH.genres),
  status: fallback(z.string(), DEFAULT_SERIES_SEARCH.status).default(DEFAULT_SERIES_SEARCH.status),
  types: fallback(z.array(TvShowTypeSchema), DEFAULT_SERIES_SEARCH.types).default(DEFAULT_SERIES_SEARCH.types),
  keywords: fallback(OptionsSchema, DEFAULT_SERIES_SEARCH.keywords).default(DEFAULT_SERIES_SEARCH.keywords),
  studios: fallback(OptionsSchema, DEFAULT_SERIES_SEARCH.studios).default(DEFAULT_SERIES_SEARCH.studios),
  networks: fallback(OptionsSchema, DEFAULT_SERIES_SEARCH.networks).default(DEFAULT_SERIES_SEARCH.networks),
  originalLanguage: z.string().optional(),
  watchProviders: fallback(z.array(z.number()), DEFAULT_SERIES_SEARCH.watchProviders).default(
    DEFAULT_SERIES_SEARCH.watchProviders,
  ),
  adult: fallback(z.boolean(), DEFAULT_SERIES_SEARCH.adult).default(DEFAULT_SERIES_SEARCH.adult),
});

export type SeriesSearchParams = z.infer<typeof SeriesSearchSchema>;

export const Route = createFileRoute('/(series)/_sidebar/series')({
  validateSearch: zodValidator(SeriesSearchSchema),
  search: {
    middlewares: [
      stripSearchParams(DEFAULT_SERIES_SEARCH),
      // retainSearchParams(Object.keys(DEFAULT_SERIES_SEARCH) as Array<keyof typeof DEFAULT_SERIES_SEARCH>),
      retainSearchParams(true),
    ],
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureInfiniteQueryData(seriesQueryOptions(deps)),
  pendingMs: 0,
  pendingComponent: SkeletonCards,
  component: SeriesCards,
});

function SkeletonCards() {
  return Array.from({ length: 60 }).map((_, index) => (
    <Skeleton className="aspect-[2/3] w-full border border-gray-6" key={`placeholder-${index}`} />
  ));
}

function SeriesCards() {
  const deps = Route.useLoaderDeps();
  const [loadMoreRef, entry] = useIntersectionObserver();

  const {
    data: series,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(seriesQueryOptions(deps));

  React.useEffect(() => {
    if (entry?.isIntersecting && !isFetchingNextPage && hasNextPage) {
      void fetchNextPage();
    }
  }, [entry, fetchNextPage, isFetchingNextPage, hasNextPage]);

  if (series.pages[0]?.totalResults === 0) {
    return <div className="col-span-full mt-48 grid place-items-center text-gray-11">No results</div>;
  }

  return (
    <>
      {series.pages.map(({ page, results }) => (
        <React.Fragment key={page}>
          {results.map((show) => (
            <li key={show.id}>
              <SeriesCard series={show} />
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
