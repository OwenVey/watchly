import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, stripSearchParams, useNavigate } from '@tanstack/react-router';
import * as v from 'valibot';
import { MovieCard } from '@/components/movie-card';
import { PersonCard } from '@/components/person-card';
import { SeriesCard } from '@/components/series-card';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trendingQueryOptions } from '@/query-options';
import { TrendingMediaTypeSchema } from '@/schemas';
import type { TrendingMediaType } from '@/types';

const TRENDING_MEDIA_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movies' },
  { label: 'Series', value: 'tv' },
  { label: 'People', value: 'people' },
] satisfies { label: string; value: TrendingMediaType }[];

const TrendingSearchSchema = v.object({
  media: v.fallback(TrendingMediaTypeSchema, 'all'),
  timeWindow: v.fallback(v.picklist(['day', 'week']), 'day'),
});

export const Route = createFileRoute('/trending')({
  validateSearch: TrendingSearchSchema,
  search: {
    middlewares: [stripSearchParams({ media: 'all' })],
  },
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(trendingQueryOptions(deps)),
  component: Trending,
});

function Trending() {
  const { media, timeWindow } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data } = useSuspenseQuery(trendingQueryOptions({ media, timeWindow }));

  return (
    <div className="flex w-full flex-1 flex-col p-4">
      <FieldSet>
        <FieldGroup className="flex-row sm:max-w-sm">
          <Field>
            <FieldLabel htmlFor="trending-media">Media</FieldLabel>
            <Select
              items={TRENDING_MEDIA_OPTIONS}
              value={media}
              onValueChange={(value) => navigate({ search: (prev) => ({ ...prev, media: value ?? 'all' }) })}
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
              onValueChange={(value) => navigate({ search: (prev) => ({ ...prev, timeWindow: value ?? 'day' }) })}
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
          {data.results.map((result) => (
            <li key={result.id}>
              {result.media_type === 'movie' && <MovieCard movie={result} showBadge />}
              {result.media_type === 'tv' && <SeriesCard series={result} showBadge />}
              {result.media_type === 'person' && <PersonCard person={result} title={result.known_for_department} />}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
