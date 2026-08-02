import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute, retainSearchParams, stripSearchParams, useNavigate } from '@tanstack/react-router';
import * as v from 'valibot';
import { CardNameToggle } from '@/components/card-name-toggle';
import { MovieCard } from '@/components/movie-card';
import { PersonCard } from '@/components/person-card';
import { FullPageGridPending } from '@/components/route-pending';
import { SeriesCard } from '@/components/series-card';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { CARD_GRID_SIZE_CLASSES, DEFAULT_CARD_VIEW } from '@/lib/constants';
import { cn } from '@/lib/utils';
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
  ...DEFAULT_CARD_VIEW,
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
    showNames: v.optional(
      v.fallback(v.boolean(), DEFAULT_TRENDING_SEARCH.showNames),
      DEFAULT_TRENDING_SEARCH.showNames,
    ),
    showRatings: v.optional(
      v.fallback(v.boolean(), DEFAULT_TRENDING_SEARCH.showRatings),
      DEFAULT_TRENDING_SEARCH.showRatings,
    ),
    showYears: v.optional(
      v.fallback(v.boolean(), DEFAULT_TRENDING_SEARCH.showYears),
      DEFAULT_TRENDING_SEARCH.showYears,
    ),
    cardSize: v.optional(
      v.fallback(v.picklist(['small', 'medium', 'large']), DEFAULT_TRENDING_SEARCH.cardSize),
      DEFAULT_TRENDING_SEARCH.cardSize,
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
  pendingComponent: FullPageGridPending,
  component: Trending,
});

function Trending() {
  const { cardSize, media, showNames, showRatings, showYears, timeWindow } = Route.useLoaderDeps();
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
        <FieldGroup className="flex-row sm:max-w-md">
          <Field>
            <FieldLabel htmlFor="trending-media">Media</FieldLabel>
            <Select
              items={TRENDING_MEDIA_OPTIONS}
              value={media}
              onValueChange={(value) => navigate({ search: { media: value ?? undefined } })}
            >
              <SelectTrigger id="trending-media">
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
              <SelectTrigger id="trending-time-window">
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

          <CardNameToggle
            checked={showNames}
            className="self-end sm:h-8"
            onCheckedChange={(showNames) => void navigate({ search: { showNames } })}
          />
        </FieldGroup>
      </FieldSet>

      <div className="w-full">
        <h1 className="mt-4 text-2xl font-semibold text-foreground">Search Results</h1>
        <ul className={cn('grid auto-rows-min gap-4', CARD_GRID_SIZE_CLASSES[cardSize])}>
          {data.pages.map(({ page, results }) =>
            results.map((result) => (
              <li key={`${page}-${result.media_type}-${result.id}`}>
                {result.media_type === 'movie' && (
                  <MovieCard
                    movie={result}
                    showBadge={media === 'all'}
                    showName={showNames}
                    showRating={showRatings}
                    showYear={showYears}
                  />
                )}
                {result.media_type === 'tv' && (
                  <SeriesCard
                    series={result}
                    showBadge={media === 'all'}
                    showName={showNames}
                    showRating={showRatings}
                    showYear={showYears}
                  />
                )}
                {result.media_type === 'person' && <PersonCard person={result} title={result.known_for_department} />}
              </li>
            )),
          )}
        </ul>

        {isFetchingNextPage ? (
          <ul className={cn('mt-4 grid auto-rows-min gap-4', CARD_GRID_SIZE_CLASSES[cardSize])}>
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
