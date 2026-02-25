import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import React from 'react';
import * as v from "valibot";
import { SeriesCard } from '@/components/series-card';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_SERIES_SEARCH } from '@/lib/constants';
import { seriesQueryOptions } from '@/query-options';
import { OptionsSchema, TvShowTypeSchema } from '@/schemas';

const SeriesSearchSchema = v.object({
  firstAirDateAfter: v.fallback(v.optional(v.pipe(v.unknown(), v.toDate())), DEFAULT_SERIES_SEARCH.firstAirDateAfter),
  firstAirDateBefore: v.fallback(v.optional(v.pipe(v.unknown(), v.toDate())), DEFAULT_SERIES_SEARCH.firstAirDateBefore),
  ratingMin: v.fallback(
    v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_SERIES_SEARCH.ratingMax - 1)), DEFAULT_SERIES_SEARCH.ratingMin),
    DEFAULT_SERIES_SEARCH.ratingMin,
  ),
  ratingMax: v.fallback(
    v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_SERIES_SEARCH.ratingMax)), DEFAULT_SERIES_SEARCH.ratingMax),
    DEFAULT_SERIES_SEARCH.ratingMax,
  ),
  voteCountMin: v.fallback(
    v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_SERIES_SEARCH.voteCountMax - 1)), DEFAULT_SERIES_SEARCH.voteCountMin),
    DEFAULT_SERIES_SEARCH.voteCountMin,
  ),
  voteCountMax: v.fallback(
    v.optional(v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_SERIES_SEARCH.voteCountMax)), DEFAULT_SERIES_SEARCH.voteCountMax),
    DEFAULT_SERIES_SEARCH.voteCountMax,
  ),
  sort: v.fallback(
    v.optional(v.picklist(['first_air_date', 'name', 'popularity', 'vote_average', 'vote_count']), DEFAULT_SERIES_SEARCH.sort),
    DEFAULT_SERIES_SEARCH.sort,
  ),
  sortDir: v.fallback(v.optional(v.picklist(['asc', 'desc']), DEFAULT_SERIES_SEARCH.sortDir), DEFAULT_SERIES_SEARCH.sortDir),
  genres: v.fallback(v.optional(v.array(v.number()), DEFAULT_SERIES_SEARCH.genres), DEFAULT_SERIES_SEARCH.genres),
  status: v.fallback(v.optional(v.string(), DEFAULT_SERIES_SEARCH.status), DEFAULT_SERIES_SEARCH.status),
  types: v.fallback(v.optional(v.array(TvShowTypeSchema), DEFAULT_SERIES_SEARCH.types), DEFAULT_SERIES_SEARCH.types),
  keywords: v.fallback(v.optional(OptionsSchema, DEFAULT_SERIES_SEARCH.keywords), DEFAULT_SERIES_SEARCH.keywords),
  studios: v.fallback(v.optional(OptionsSchema, DEFAULT_SERIES_SEARCH.studios), DEFAULT_SERIES_SEARCH.studios),
  networks: v.fallback(v.optional(OptionsSchema, DEFAULT_SERIES_SEARCH.networks), DEFAULT_SERIES_SEARCH.networks),
  originalLanguage: v.fallback(v.optional(v.string()), DEFAULT_SERIES_SEARCH.originalLanguage),
  watchProviders: v.fallback(v.optional(v.array(v.number()), DEFAULT_SERIES_SEARCH.watchProviders), DEFAULT_SERIES_SEARCH.watchProviders),
  adult: v.fallback(v.optional(v.boolean(), DEFAULT_SERIES_SEARCH.adult), DEFAULT_SERIES_SEARCH.adult),
});

export type SeriesSearchParams = v.InferOutput<typeof SeriesSearchSchema>;

export const Route = createFileRoute('/(series)/_sidebar/series')({
  validateSearch: SeriesSearchSchema,
  search: {
    middlewares: [
      // retainSearchParams(true),
      // retainSearchParams(Object.keys({...DEFAULT_SERIES_SEARCH}) as Array<keyof typeof DEFAULT_SERIES_SEARCH>),
      stripSearchParams({ ...DEFAULT_SERIES_SEARCH }),
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
    <Skeleton className="aspect-2/3 w-full border" key={`placeholder-${index}`} />
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
    return <div className="col-span-full mt-48 grid place-items-center text-muted-foreground">No results</div>;
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
            <Skeleton className="aspect-2/3 w-full border" />
          </li>
        ))}

      <div ref={loadMoreRef} className="h-1" />
    </>
  );
}
