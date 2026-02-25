import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import React from 'react';
import { z } from '@/lib/valibot-zod';
import { SeriesCard } from '@/components/series-card';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_SERIES_SEARCH } from '@/lib/constants';
import { seriesQueryOptions } from '@/query-options';
import { OptionsSchema, TvShowTypeSchema } from '@/schemas';

const SeriesSearchSchema = z.object({
  firstAirDateAfter: z.coerce.date().optional().catch(DEFAULT_SERIES_SEARCH.firstAirDateAfter),
  firstAirDateBefore: z.coerce.date().optional().catch(DEFAULT_SERIES_SEARCH.firstAirDateBefore),
  ratingMin: z
    .number()
    .min(1)
    .max(DEFAULT_SERIES_SEARCH.ratingMax - 1)
    .default(DEFAULT_SERIES_SEARCH.ratingMin)
    .catch(DEFAULT_SERIES_SEARCH.ratingMin),
  ratingMax: z
    .number()
    .min(1)
    .max(DEFAULT_SERIES_SEARCH.ratingMax)
    .default(DEFAULT_SERIES_SEARCH.ratingMax)
    .catch(DEFAULT_SERIES_SEARCH.ratingMax),
  voteCountMin: z
    .number()
    .min(1)
    .max(DEFAULT_SERIES_SEARCH.voteCountMax - 1)
    .default(DEFAULT_SERIES_SEARCH.voteCountMin)
    .catch(DEFAULT_SERIES_SEARCH.voteCountMin),
  voteCountMax: z
    .number()
    .min(1)
    .max(DEFAULT_SERIES_SEARCH.voteCountMax)
    .default(DEFAULT_SERIES_SEARCH.voteCountMax)
    .catch(DEFAULT_SERIES_SEARCH.voteCountMax),
  sort: z
    .enum(['first_air_date', 'name', 'popularity', 'vote_average', 'vote_count'])
    .default(DEFAULT_SERIES_SEARCH.sort)
    .catch(DEFAULT_SERIES_SEARCH.sort),
  sortDir: z.enum(['asc', 'desc']).default(DEFAULT_SERIES_SEARCH.sortDir).catch(DEFAULT_SERIES_SEARCH.sortDir),
  genres: z.array(z.number()).default(DEFAULT_SERIES_SEARCH.genres).catch(DEFAULT_SERIES_SEARCH.genres),
  status: z.string().default(DEFAULT_SERIES_SEARCH.status).catch(DEFAULT_SERIES_SEARCH.status),
  types: z.array(TvShowTypeSchema).default(DEFAULT_SERIES_SEARCH.types).catch(DEFAULT_SERIES_SEARCH.types),
  keywords: OptionsSchema.default(DEFAULT_SERIES_SEARCH.keywords).catch(DEFAULT_SERIES_SEARCH.keywords),
  studios: OptionsSchema.default(DEFAULT_SERIES_SEARCH.studios).catch(DEFAULT_SERIES_SEARCH.studios),
  networks: OptionsSchema.default(DEFAULT_SERIES_SEARCH.networks).catch(DEFAULT_SERIES_SEARCH.networks),
  originalLanguage: z.string().optional().catch(DEFAULT_SERIES_SEARCH.originalLanguage),
  watchProviders: z
    .array(z.number())
    .default(DEFAULT_SERIES_SEARCH.watchProviders)
    .catch(DEFAULT_SERIES_SEARCH.watchProviders),
  adult: z.boolean().default(DEFAULT_SERIES_SEARCH.adult).catch(DEFAULT_SERIES_SEARCH.adult),
});

export type SeriesSearchParams = z.infer<typeof SeriesSearchSchema>;

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
