import MultipleSelector from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { MOVIE_GENRES, RELEASE_TYPES } from '@/lib/constants';
import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowDownIcon, ArrowUpIcon, FilterXIcon } from 'lucide-react';
import React from 'react';
import { DEFAULT_MOVIE_SEARCH, type MovieSearchParams, Route as MoviesRoute } from './_layout.movies.js';

export const Route = createFileRoute('/(movies)/_layout')({
  component: () => (
    <>
      <FilterSidebar />
      <main className="flex-1 overflow-y-auto p-4 pt-0">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
          <Outlet />
        </div>
      </main>
    </>
  ),
});

function FilterSidebar() {
  const { adult, ratingMin, ratingMax, voteCountMin, voteCountMax, sort, sortDir, genres, releaseTypes } =
    MoviesRoute.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [rating, setRating] = React.useState([ratingMin, ratingMax]);
  const [voteCount, setVoteCount] = React.useState([voteCountMin, voteCountMax]);

  return (
    <aside className="mb-4 ml-4 flex w-64 flex-col overflow-y-auto rounded-xl border border-gray-5 bg-gray-2 p-4">
      <h2 className="mb-4 font-semibold text-lg">Filters</h2>

      <div className="flex flex-1 flex-col gap-6">
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

        {/* Sort dropdown*/}
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

            <Link to="." search={{ sortDir: sortDir === 'asc' ? 'desc' : 'asc' }}>
              <Button asChild className="shrink-0" size="icon" variant="outline">
                {sortDir === 'asc' ? <ArrowUpIcon className="size-5" /> : <ArrowDownIcon className="size-5" />}
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Genres</Label>
          <MultipleSelector
            value={genres.map((value) => ({
              value,
              label: MOVIE_GENRES.find((option) => option.value === value)?.label ?? 'Unknown',
            }))}
            onChange={(options) =>
              navigate({
                search: { genres: options.map(({ value }) => value) },
              })
            }
            defaultOptions={MOVIE_GENRES}
            placeholder="Select genre(s)..."
            hidePlaceholderWhenSelected
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Release Type</Label>
          <MultipleSelector
            value={releaseTypes.map((value) => ({
              value,
              label: RELEASE_TYPES.find((option) => option.value === value)?.label ?? 'Unknown',
            }))}
            onChange={(options) =>
              navigate({
                search: { releaseTypes: options.map(({ value }) => value) },
              })
            }
            defaultOptions={RELEASE_TYPES}
            placeholder="Select release type(s)..."
            hidePlaceholderWhenSelected
          />
        </div>

        {/* Adult Content */}
        <div className="flex items-center gap-2">
          <Switch id="adult-content" checked={adult} onCheckedChange={(adult) => navigate({ search: { adult } })} />
          <Label htmlFor="adult-content">Include Adult Content</Label>
        </div>
      </div>

      <Link to="/movies" search={DEFAULT_MOVIE_SEARCH}>
        <Button asChild className="w-full" variant="secondary">
          <FilterXIcon className="mr-2 size-5" />
          Clear
        </Button>
      </Link>
    </aside>
  );
}
