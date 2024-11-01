import MultipleSelector from '@/components/multi-select';
import { ShowMoreButton } from '@/components/show-more-button';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar.js';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton.js';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.js';
import { tmdbApi } from '@/lib/api.js';
import { LANGUAGES_MAP, MOVIE_GENRES_MAP, RELEASE_TYPE_MAP } from '@/lib/constants';
import { cn, formatMinutesToHHMM, getTmdbImage, toggleItemInArray } from '@/lib/utils.js';
import { DEFAULT_MOVIE_SEARCH, type MovieSearchParams, Route as MoviesRoute } from '@/routes/(movies)/_sidebar/movies';
import { Await, createFileRoute, Link, Outlet, useNavigate } from '@tanstack/react-router';
import { useToggle } from '@uidotdev/usehooks';
import { format } from 'date-fns';
import { ArrowDownIcon, ArrowUpIcon, CalendarIcon, FilterIcon, FilterXIcon } from 'lucide-react';
import React, { useEffect } from 'react';

export const Route = createFileRoute('/(movies)/_sidebar')({
  loader: () => {
    return {
      providersPromise: tmdbApi('/watch/providers/movie', { query: { watch_region: 'US' } }),
    };
  },
  gcTime: 0,
  shouldReload: false,
  component: SidebarLayout,
});

function SidebarLayout() {
  return (
    <>
      <Card
        asChild
        className="sticky top-[94px] left-4 m-4 mr-0 hidden max-h-[calc(100vh-94px-16px)] w-80 flex-col md:flex"
      >
        <aside>
          <Filters />
        </aside>
      </Card>
      <main className="flex flex-1 flex-col">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="mx-4 mt-4 md:hidden" variant="glass">
              <FilterIcon />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <Filters />
          </SheetContent>
        </Sheet>

        <ul className="grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 p-4">
          <Outlet />
        </ul>
      </main>
    </>
  );
}

function Filters() {
  const { providersPromise } = Route.useLoaderData();

  const search = MoviesRoute.useSearch();
  const {
    releasedAfter,
    releasedBefore,
    ratingMin,
    ratingMax,
    voteCountMin,
    voteCountMax,
    runtimeMin,
    runtimeMax,
    sort,
    sortDir,
    genres,
    releaseTypes,
    keywords,
    studios,
    originalLanguage,
    watchProviders,
    adult,
  } = search;

  const navigate = useNavigate({ from: Route.fullPath });

  const [rating, setRating] = React.useState([ratingMin, ratingMax]);
  const [voteCount, setVoteCount] = React.useState([voteCountMin, voteCountMax]);
  const [runtime, setRuntime] = React.useState([runtimeMin, runtimeMax]);
  const [showAllServices, toggleShowAllServices] = useToggle(false);

  useEffect(() => {
    setRating([ratingMin, ratingMax]);
  }, [ratingMin, ratingMax]);

  useEffect(() => {
    setVoteCount([voteCountMin, voteCountMax]);
  }, [voteCountMin, voteCountMax]);

  useEffect(() => {
    setRuntime([runtimeMin, runtimeMax]);
  }, [runtimeMin, runtimeMax]);

  return (
    <>
      <div className="border-b border-gray-6 px-4 py-2">
        <h2 className="text-lg font-semibold text-gray-12">Filters</h2>
        <div className="text-sm text-gray-11">
          {
            Object.keys(search).filter((key) => {
              const typedKey = key as keyof typeof search;
              return JSON.stringify(search[typedKey]) !== JSON.stringify(DEFAULT_MOVIE_SEARCH[typedKey]);
            }).length
          }{' '}
          Active
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
        {/* Release Date */}
        <div className="flex flex-col gap-1.5">
          <Label>Release Date</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'flex-1 justify-start px-3 text-left font-normal',
                    !releasedAfter && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="text-gray-9" />
                  {releasedAfter ? format(releasedAfter, 'P') : <span className="text-gray-9">After</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={releasedAfter}
                  onSelect={(releasedAfter) => navigate({ search: { releasedAfter } })}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'flex-1 justify-start px-3 text-left font-normal',
                    !releasedBefore && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="text-gray-9" />
                  {releasedBefore ? format(releasedBefore, 'P') : <span className="text-gray-9">Before</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={releasedBefore}
                  onSelect={(releasedBefore) => navigate({ search: { releasedBefore } })}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Rating */}
        <div className="flex flex-col gap-1.5">
          <Label>Rating</Label>
          <Slider
            className="mt-1 mb-4"
            value={rating}
            onValueChange={setRating}
            onValueCommit={([ratingMin, ratingMax]) => navigate({ search: { ratingMin, ratingMax } })}
            defaultValue={[DEFAULT_MOVIE_SEARCH.ratingMin, DEFAULT_MOVIE_SEARCH.ratingMax]}
            min={DEFAULT_MOVIE_SEARCH.ratingMin}
            max={DEFAULT_MOVIE_SEARCH.ratingMax}
            step={1}
            minStepsBetweenThumbs={1}
            label={(value) => value}
          />
        </div>

        {/* Vote Count */}
        <div className="flex flex-col gap-1.5">
          <Label>Vote Count</Label>
          <Slider
            className="mt-1 mb-4"
            value={voteCount}
            onValueChange={setVoteCount}
            onValueCommit={([voteCountMin, voteCountMax]) => navigate({ search: { voteCountMin, voteCountMax } })}
            defaultValue={[DEFAULT_MOVIE_SEARCH.voteCountMin, DEFAULT_MOVIE_SEARCH.voteCountMax]}
            min={DEFAULT_MOVIE_SEARCH.voteCountMin}
            max={DEFAULT_MOVIE_SEARCH.voteCountMax}
            step={1}
            minStepsBetweenThumbs={1}
            label={(value) => value?.toLocaleString()}
          />
        </div>

        {/* Runtime */}
        <div className="flex flex-col gap-1.5">
          <Label>Runtime</Label>
          <Slider
            className="mt-1 mb-4"
            value={runtime}
            onValueChange={setRuntime}
            onValueCommit={([runtimeMin, runtimeMax]) => navigate({ search: { runtimeMin, runtimeMax } })}
            defaultValue={[DEFAULT_MOVIE_SEARCH.runtimeMin, DEFAULT_MOVIE_SEARCH.runtimeMax]}
            min={DEFAULT_MOVIE_SEARCH.runtimeMin}
            max={DEFAULT_MOVIE_SEARCH.runtimeMax}
            step={1}
            minStepsBetweenThumbs={1}
            label={(value) => formatMinutesToHHMM(value ?? 0)}
          />
        </div>

        {/* Sort */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sort">Sort By</Label>
          <div className="flex gap-2">
            <Select
              defaultValue="popularity"
              value={sort}
              onValueChange={(sort: MovieSearchParams['sort']) => navigate({ search: { sort } })}
            >
              <SelectTrigger id="sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vote_average">Rating</SelectItem>
                <SelectItem value="primary_release_date">Release Date</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="vote_count">Vote Count</SelectItem>
              </SelectContent>
            </Select>

            <Link
              to="."
              search={{ sortDir: sortDir === 'asc' ? 'desc' : 'asc' }}
              className={cn('shrink-0', buttonVariants({ variant: 'outline', size: 'icon' }))}
            >
              {sortDir === 'asc' ? <ArrowUpIcon className="size-5" /> : <ArrowDownIcon className="size-5" />}
            </Link>
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-col gap-1.5">
          <Label>Genres</Label>
          <MultipleSelector
            value={genres.map((value) => ({
              value: value.toString(),
              label: MOVIE_GENRES_MAP[value as keyof typeof MOVIE_GENRES_MAP],
            }))}
            onChange={(options) =>
              navigate({
                search: { genres: options.map(({ value }) => +value) },
              })
            }
            defaultOptions={Object.entries(MOVIE_GENRES_MAP).map(([value, label]) => ({ label, value }))}
            placeholder="Select genres"
            hidePlaceholderWhenSelected
          />
        </div>

        {/* Release Type */}
        <div className="flex flex-col gap-1.5">
          <Label>Release Type</Label>
          <MultipleSelector
            value={releaseTypes.map((value) => ({
              value: value.toString(),
              label: RELEASE_TYPE_MAP[value],
            }))}
            onChange={(options) =>
              navigate({
                search: { releaseTypes: options.map(({ value }) => +value) },
              })
            }
            defaultOptions={Object.entries(RELEASE_TYPE_MAP).map(([value, label]) => ({ label, value }))}
            placeholder="Select release types"
            hidePlaceholderWhenSelected
          />
        </div>

        {/* Keywords */}
        <div className="flex flex-col gap-1.5">
          <Label>Keywords</Label>
          <MultipleSelector
            onSearch={async (query) => {
              const { results } = await tmdbApi('/search/keyword', { query: { query } });
              return results.map(({ id, name }) => ({ value: id.toString(), label: name }));
            }}
            value={keywords}
            onChange={(keywords) => navigate({ search: { keywords } })}
            placeholder="Search keywords"
            initialMessage="Start typing to search"
            hidePlaceholderWhenSelected
          />
        </div>

        {/* Studio */}
        <div className="flex flex-col gap-1.5">
          <Label>Studio</Label>
          <MultipleSelector
            onSearch={async (query) => {
              const { results } = await tmdbApi('/search/company', { query: { query } });
              return results.map(({ id, name }) => ({ value: id.toString(), label: name }));
            }}
            value={studios}
            onChange={(studios) => navigate({ search: { studios } })}
            placeholder="Search studios"
            initialMessage="Start typing to search"
            hidePlaceholderWhenSelected
          />
        </div>

        {/* Original Language */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="original-language">Original Language</Label>
          <Select
            key={originalLanguage}
            value={originalLanguage}
            onValueChange={(originalLanguage) => navigate({ search: { originalLanguage } })}
          >
            <SelectTrigger id="original-language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(LANGUAGES_MAP).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Streaming Services */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="streaming-services">Streaming Services</Label>
          <div className="grid grid-cols-5 gap-1">
            <Await
              promise={providersPromise}
              fallback={Array.from({ length: 10 }).map((_, index) => (
                <Skeleton className="aspect-square" key={`placeholder-${index}`} />
              ))}
            >
              {({ results: providers }) =>
                providers
                  .sort((a, b) => a.display_priority - b.display_priority)
                  .slice(0, showAllServices ? providers.length : 10)
                  .map((provider) => (
                    <Tooltip key={provider.provider_id}>
                      <TooltipTrigger asChild>
                        <Link
                          to="."
                          search={{ watchProviders: toggleItemInArray(watchProviders, provider.provider_id) }}
                          className={cn(
                            'aspect-square overflow-hidden rounded-lg border p-1.5',
                            'outline-none focus-visible:border-gray-12 focus-visible:ring-1 focus-visible:ring-gray-12',
                            watchProviders.includes(provider.provider_id)
                              ? 'border-primary-7 bg-primary-3 hover:border-primary-8 hover:bg-primary-5'
                              : 'border-gray-7 bg-gray-3 hover:border-gray-8 hover:bg-gray-5',
                          )}
                        >
                          {provider.logo_path && (
                            <img
                              src={getTmdbImage('logo', provider.logo_path, 'w92')}
                              alt={`${provider.provider_name} logo`}
                              className="rounded-md"
                            />
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>{provider.provider_name}</TooltipContent>
                    </Tooltip>
                  ))
              }
            </Await>
          </div>
          <ShowMoreButton className="mt-1 w-full" onClick={() => toggleShowAllServices()} showAll={showAllServices} />
        </div>

        {/* Adult Content */}
        <div className="flex items-center gap-2">
          <Switch id="adult-content" checked={adult} onCheckedChange={(adult) => navigate({ search: { adult } })} />
          <Label htmlFor="adult-content">Include Adult Content</Label>
        </div>
      </div>

      <div className="border-t border-gray-6 p-4">
        {/* Clear Filters */}
        <Link
          to="/movies"
          search={DEFAULT_MOVIE_SEARCH}
          className={cn('w-full', buttonVariants({ variant: 'outline' }))}
        >
          <FilterXIcon />
          Clear Filters
        </Link>
      </div>
    </>
  );
}
