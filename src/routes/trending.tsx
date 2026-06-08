import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, retainSearchParams, stripSearchParams, useNavigate } from '@tanstack/react-router';
import * as v from 'valibot';
import { MovieCard } from '@/components/movie-card';
import { PersonCard } from '@/components/person-card';
import { FullPageGridPending } from '@/components/route-pending';
import { SeriesCard } from '@/components/series-card';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { trendingQueryOptions } from '@/query-options';
import { TrendingMediaTypeSchema } from '@/schemas';
import type { TrendingMediaType } from '@/types';

const TRENDING_MEDIA_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movies' },
  { label: 'Series', value: 'tv' },
  { label: 'People', value: 'people' },
] satisfies { label: string; value: TrendingMediaType }[];

const DEFAULT_TRENDING_SEARCH = {
  media: 'all' as TrendingMediaType,
  timeWindow: 'day' as 'day' | 'week',
};

export const Route = createFileRoute('/trending')({
  validateSearch: v.object({
    media: v.optional(
      v.fallback(TrendingMediaTypeSchema, DEFAULT_TRENDING_SEARCH.media),
      DEFAULT_TRENDING_SEARCH.media,
    ),
    timeWindow: v.optional(
      v.fallback(v.picklist(['day', 'week']), DEFAULT_TRENDING_SEARCH.timeWindow),
      DEFAULT_TRENDING_SEARCH.timeWindow,
    ),
  }),
  search: {
    middlewares: [
      retainSearchParams(Object.keys(DEFAULT_TRENDING_SEARCH) as Array<keyof typeof DEFAULT_TRENDING_SEARCH>),
      stripSearchParams(DEFAULT_TRENDING_SEARCH),
    ],
  },

  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureInfiniteQueryData(trendingQueryOptions(deps)),
  pendingMs: 0,
  pendingComponent: FullPageGridPending,
  component: Trending,
});

function Trending() {
  const { media, timeWindow } = Route.useLoaderDeps();
  const navigate = useNavigate({ from: Route.fullPath });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    trendingQueryOptions({ media, timeWindow }),
  );

  const { ref: loadMoreRef } = useIntersectionObserver({
    onChange: (isIntersecting) => isIntersecting && !isFetchingNextPage && hasNextPage && void fetchNextPage(),
  });

  if (data.pages[0]?.totalResults === 0) {
    return <div className="mt-48 grid w-full place-items-center text-muted-foreground">No results</div>;
  }

  return (
    <div className="flex w-full flex-1 flex-col p-4">
      <FieldSet>
        <FieldGroup className="flex-row sm:max-w-sm">
          <Field>
            <FieldLabel htmlFor="trending-media">Media</FieldLabel>
            <Select
              items={TRENDING_MEDIA_OPTIONS}
              value={media}
              onValueChange={(value) => navigate({ search: { media: value ?? undefined } })}
            >
              <SelectTrigger id="trending-media" className="w-full">
                <SelectValue placeholder="Select media" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {TRENDING_MEDIA_OPTIONS.map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel htmlFor="trending-time-window">Time Window</FieldLabel>
            <Select
              items={[
                { label: 'Day', value: 'day' },
                { label: 'Week', value: 'week' },
              ]}
              value={timeWindow}
              onValueChange={(value) => navigate({ search: { timeWindow: value ?? undefined } })}
            >
              <SelectTrigger id="trending-time-window" className="w-full">
                <SelectValue placeholder="Select time window" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[
                    { label: 'Day', value: 'day' },
                    { label: 'Week', value: 'week' },
                  ].map(({ label, value }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </FieldSet>

      <div className="w-full">
        <h1 className="mt-4 text-2xl font-semibold text-foreground">Search Results</h1>
        <ul className="grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
          {data.pages.map(({ page, results }) =>
            results.map((result) => (
              <li key={`${page}-${result.media_type}-${result.id}`}>
                {result.media_type === 'movie' && <MovieCard movie={result} showBadge={media === 'all'} />}
                {result.media_type === 'tv' && <SeriesCard series={result} showBadge={media === 'all'} />}
                {result.media_type === 'person' && <PersonCard person={result} title={result.known_for_department} />}
              </li>
            )),
          )}
        </ul>

        {isFetchingNextPage ? (
          <ul className="mt-4 grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
            {Array.from({ length: 60 }).map((_, index) => (
              <li key={`placeholder-${index}`}>
                <Skeleton className="aspect-2/3 w-full border" />
              </li>
            ))}
          </ul>
        ) : (
          <div ref={loadMoreRef} className="h-1" />
        )}
      </div>
    </div>
  );
}
