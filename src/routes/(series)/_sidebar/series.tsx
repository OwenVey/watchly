import { DiscoverTVType } from '@lorenzopant/tmdb';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, retainSearchParams, stripSearchParams } from '@tanstack/react-router';
import React from 'react';
import * as v from 'valibot';
import { SeriesCard } from '@/components/series-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { DEFAULT_SERIES_SEARCH, LANGUAGES_MAP } from '@/lib/constants';
import { schemaObjectKeys } from '@/lib/utils';
import { seriesQueryOptions } from '@/query-options';
import { OptionsSchema } from '@/schemas';

const SeriesSearchSchema = v.object({
  firstAirDateAfter: v.optional(v.pipe(v.string(), v.isoTimestamp())),
  firstAirDateBefore: v.optional(v.pipe(v.string(), v.isoTimestamp())),
  ratingMin: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_SERIES_SEARCH.ratingMax - 1)),
      DEFAULT_SERIES_SEARCH.ratingMin,
    ),
    DEFAULT_SERIES_SEARCH.ratingMin,
  ),
  ratingMax: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_SERIES_SEARCH.ratingMax)),
      DEFAULT_SERIES_SEARCH.ratingMax,
    ),
    DEFAULT_SERIES_SEARCH.ratingMax,
  ),
  voteCountMin: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_SERIES_SEARCH.voteCountMax - 1)),
      DEFAULT_SERIES_SEARCH.voteCountMin,
    ),
    DEFAULT_SERIES_SEARCH.voteCountMin,
  ),
  voteCountMax: v.optional(
    v.fallback(
      v.pipe(v.number(), v.minValue(1), v.maxValue(DEFAULT_SERIES_SEARCH.voteCountMax)),
      DEFAULT_SERIES_SEARCH.voteCountMax,
    ),
    DEFAULT_SERIES_SEARCH.voteCountMax,
  ),
  sort: v.optional(
    v.fallback(
      v.picklist(['first_air_date', 'name', 'popularity', 'vote_average', 'vote_count']),
      DEFAULT_SERIES_SEARCH.sort,
    ),
    DEFAULT_SERIES_SEARCH.sort,
  ),
  sortDir: v.optional(
    v.fallback(v.picklist(['asc', 'desc']), DEFAULT_SERIES_SEARCH.sortDir),
    DEFAULT_SERIES_SEARCH.sortDir,
  ),
  genres: v.optional(v.fallback(v.array(v.number()), DEFAULT_SERIES_SEARCH.genres), DEFAULT_SERIES_SEARCH.genres),
  status: v.optional(v.fallback(v.string(), DEFAULT_SERIES_SEARCH.status), DEFAULT_SERIES_SEARCH.status),
  types: v.optional(
    v.fallback(v.array(v.picklist(Object.values(DiscoverTVType))), DEFAULT_SERIES_SEARCH.types),
    DEFAULT_SERIES_SEARCH.types,
  ),
  keywords: v.optional(v.fallback(OptionsSchema, DEFAULT_SERIES_SEARCH.keywords), DEFAULT_SERIES_SEARCH.keywords),
  studios: v.optional(v.fallback(OptionsSchema, DEFAULT_SERIES_SEARCH.studios), DEFAULT_SERIES_SEARCH.studios),
  networks: v.optional(v.fallback(OptionsSchema, DEFAULT_SERIES_SEARCH.networks), DEFAULT_SERIES_SEARCH.networks),
  originalLanguage: v.optional(schemaObjectKeys(LANGUAGES_MAP)),
  watchProviders: v.optional(
    v.fallback(v.array(v.number()), DEFAULT_SERIES_SEARCH.watchProviders),
    DEFAULT_SERIES_SEARCH.watchProviders,
  ),
  adult: v.optional(v.fallback(v.boolean(), DEFAULT_SERIES_SEARCH.adult), DEFAULT_SERIES_SEARCH.adult),
});

export type SeriesSearchParams = v.InferOutput<typeof SeriesSearchSchema>;

export const Route = createFileRoute('/(series)/_sidebar/series')({
  validateSearch: SeriesSearchSchema,
  search: {
    middlewares: [
      retainSearchParams(Object.keys(DEFAULT_SERIES_SEARCH) as Array<keyof typeof DEFAULT_SERIES_SEARCH>),
      stripSearchParams(DEFAULT_SERIES_SEARCH),
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
