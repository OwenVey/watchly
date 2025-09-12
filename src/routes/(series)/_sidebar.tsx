import { ShowMoreButton } from '@/components/show-more-button';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar.js';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Multiselect } from '@/components/ui/multiselect';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton.js';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.js';
import { tmdbApi } from '@/lib/api.js';
import {
  DEFAULT_SERIES_SEARCH,
  LANGUAGES_MAP,
  SERIES_GENRES_MAP,
  TV_SHOW_STATUS_MAP,
  TV_SHOW_TYPE_MAP,
} from '@/lib/constants';
import { cn, getTmdbImage, toggleItemInArray } from '@/lib/utils.js';
import { Route as SeriesRoute, type SeriesSearchParams } from '@/routes/(series)/_sidebar/series';
import { Await, createFileRoute, Link, Outlet, useNavigate } from '@tanstack/react-router';
import { useToggle } from '@uidotdev/usehooks';
import { format } from 'date-fns';
import { ArrowDownIcon, ArrowUpIcon, CalendarIcon, FilterIcon, FilterXIcon } from 'lucide-react';
import React, { useEffect } from 'react';

export const Route = createFileRoute('/(series)/_sidebar')({
  loader: () => {
    return {
      providersPromise: tmdbApi('/watch/providers/tv', { query: { watch_region: 'US' } }),
    };
  },
  gcTime: 0,
  shouldReload: false,
  component: SeriesSidebar,
});

function SeriesSidebar() {
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

  const search = SeriesRoute.useSearch();
  const {
    firstAirDateAfter,
    firstAirDateBefore,
    ratingMin,
    ratingMax,
    voteCountMin,
    voteCountMax,
    sort,
    sortDir,
    genres,
    status,
    types,
    keywords,
    originalLanguage,
    networks,
    studios,
    watchProviders,
    adult,
  } = search;

  const navigate = useNavigate({ from: Route.fullPath });

  const [rating, setRating] = React.useState([ratingMin, ratingMax]);
  const [voteCount, setVoteCount] = React.useState([voteCountMin, voteCountMax]);
  const [showAllServices, toggleShowAllServices] = useToggle(false);

  useEffect(() => {
    setRating([ratingMin, ratingMax]);
  }, [ratingMin, ratingMax]);

  useEffect(() => {
    setVoteCount([voteCountMin, voteCountMax]);
  }, [voteCountMin, voteCountMax]);

  return (
    <>
      <div className="border-b border-gray-6 px-4 py-2">
        <h2 className="text-lg font-semibold text-gray-12">Filters</h2>
        <div className="text-sm text-gray-11">
          {
            Object.keys(search).filter((key) => {
              const typedKey = key as keyof typeof search;
              return JSON.stringify(search[typedKey]) !== JSON.stringify(DEFAULT_SERIES_SEARCH[typedKey]);
            }).length
          }{' '}
          Active
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
        {/* First Air Date */}
        <div className="flex flex-col gap-1.5">
          <Label>First Air Date</Label>
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'flex-1 justify-start px-3 text-left font-normal',
                    !firstAirDateAfter && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="text-gray-9" />
                  {firstAirDateAfter ? format(firstAirDateAfter, 'P') : <span className="text-gray-9">After</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={firstAirDateAfter}
                  onSelect={(firstAirDateAfter) =>
                    navigate({ to: '/series', search: (prev) => ({ ...prev, firstAirDateAfter }) })
                  }
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'flex-1 justify-start px-3 text-left font-normal',
                    !firstAirDateBefore && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="text-gray-9" />
                  {firstAirDateBefore ? format(firstAirDateBefore, 'P') : <span className="text-gray-9">Before</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={firstAirDateBefore}
                  onSelect={(firstAirDateBefore) =>
                    navigate({ to: '/series', search: (prev) => ({ ...prev, firstAirDateBefore }) })
                  }
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
            onValueCommit={([ratingMin, ratingMax]) =>
              navigate({ to: '/series', search: (prev) => ({ ...prev, ratingMin, ratingMax }) })
            }
            defaultValue={[DEFAULT_SERIES_SEARCH.ratingMin, DEFAULT_SERIES_SEARCH.ratingMax]}
            min={DEFAULT_SERIES_SEARCH.ratingMin}
            max={DEFAULT_SERIES_SEARCH.ratingMax}
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
            onValueCommit={([voteCountMin, voteCountMax]) =>
              navigate({ to: '/series', search: (prev) => ({ ...prev, voteCountMin, voteCountMax }) })
            }
            defaultValue={[DEFAULT_SERIES_SEARCH.voteCountMin, DEFAULT_SERIES_SEARCH.voteCountMax]}
            min={DEFAULT_SERIES_SEARCH.voteCountMin}
            max={DEFAULT_SERIES_SEARCH.voteCountMax}
            step={1}
            minStepsBetweenThumbs={1}
            label={(value) => `${value?.toLocaleString()}${value === DEFAULT_SERIES_SEARCH.voteCountMax ? '+' : ''}`}
          />
        </div>

        {/* Sort */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sort">Sort By</Label>
          <div className="flex gap-2">
            <Select
              defaultValue="popularity"
              value={sort}
              onValueChange={(sort: SeriesSearchParams['sort']) =>
                navigate({ to: '/series', search: (prev) => ({ ...prev, sort }) })
              }
            >
              <SelectTrigger id="sort">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="first_air_date">First Air Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="vote_average">Rating</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="vote_count">Vote Count</SelectItem>
              </SelectContent>
            </Select>

            <Link
              from={Route.fullPath}
              to="/series"
              search={(prev) => ({ ...prev, sortDir: sortDir === 'asc' ? 'desc' : 'asc' })}
              className={cn('shrink-0', buttonVariants({ variant: 'outline', size: 'icon' }))}
            >
              {sortDir === 'asc' ? <ArrowUpIcon className="size-5" /> : <ArrowDownIcon className="size-5" />}
            </Link>
          </div>
        </div>

        {/* Genres */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="genres">Genres</Label>
          <Multiselect
            id="genres"
            placeholder="Select genres"
            value={genres.map((value) => ({
              value: value.toString(),
              label: SERIES_GENRES_MAP[value as keyof typeof SERIES_GENRES_MAP],
            }))}
            onValueChange={(options) =>
              navigate({ to: '/series', search: (prev) => ({ ...prev, genres: options.map(({ value }) => +value) }) })
            }
            options={Object.entries(SERIES_GENRES_MAP).map(([value, label]) => ({ value, label }))}
          />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select
            key={status}
            value={status}
            onValueChange={(status) => navigate({ to: '/series', search: (prev) => ({ ...prev, status }) })}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(TV_SHOW_STATUS_MAP).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type */}
        <div className="flex flex-col gap-1.5">
          <Label>Types</Label>
          <Multiselect
            id="types"
            placeholder="Select show types"
            value={types.map((value) => ({
              value: value.toString(),
              label: TV_SHOW_TYPE_MAP[value],
            }))}
            onValueChange={(options) =>
              navigate({
                to: '/series',
                search: (prev) => ({
                  ...prev,
                  types: options.map(({ value }) => +value as keyof typeof TV_SHOW_TYPE_MAP),
                }),
              })
            }
            options={Object.entries(TV_SHOW_TYPE_MAP).map(([value, label]) => ({ label, value }))}
          />
        </div>

        {/* Keywords */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="keywords">Keywords</Label>
          <Multiselect
            id="keywords"
            placeholder="Select keywords"
            value={keywords}
            onValueChange={(keywords) => navigate({ to: '/series', search: (prev) => ({ ...prev, keywords }) })}
            onSearch={async (query) => {
              const { results } = await tmdbApi('/search/keyword', { query: { query } });
              return results.map(({ id, name }) => ({ value: id.toString(), label: name }));
            }}
          />
        </div>

        {/* Studios */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="studios">Studios</Label>
          <Multiselect
            id="studios"
            placeholder="Select studios"
            value={studios}
            onValueChange={(studios) => navigate({ to: '/series', search: (prev) => ({ ...prev, studios }) })}
            onSearch={async (query) => {
              const { results } = await tmdbApi('/search/company', { query: { query } });
              return results.map(({ id, name }) => ({ value: id.toString(), label: name }));
            }}
          />
        </div>

        {/* Networks */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="networks">Networks</Label>
          <Multiselect
            id="networks"
            placeholder="Select networks"
            value={networks}
            onValueChange={(networks) => navigate({ to: '/series', search: (prev) => ({ ...prev, networks }) })}
            onSearch={async (query) => {
              const { results } = await tmdbApi('/search/company', { query: { query } });
              return results.map(({ id, name }) => ({ value: id.toString(), label: name }));
            }}
          />
        </div>

        {/* Original Language */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="original-language">Original Language</Label>
          <Select
            key={originalLanguage}
            value={originalLanguage}
            onValueChange={(originalLanguage) =>
              navigate({ to: '/series', search: (prev) => ({ ...prev, originalLanguage }) })
            }
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
                          from={Route.fullPath}
                          to="/series"
                          search={(prev) => ({
                            ...prev,
                            watchProviders: toggleItemInArray(watchProviders, provider.provider_id),
                          })}
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
          <Switch
            id="adult-content"
            checked={adult}
            onCheckedChange={(adult) => navigate({ to: '/series', search: { adult } })}
          />
          <Label htmlFor="adult-content">Include Adult Content</Label>
        </div>
      </div>

      <div className="border-t border-gray-6 p-4">
        {/* Clear Filters */}
        <Link
          to="/series"
          search={{ ...DEFAULT_SERIES_SEARCH }}
          className={cn('w-full', buttonVariants({ variant: 'outline' }))}
        >
          <FilterXIcon />
          Clear Filters
        </Link>
      </div>
    </>
  );
}
