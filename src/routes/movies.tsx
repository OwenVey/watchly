import MultipleSelector from '@/components/multi-select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { movieApi } from '@/lib/api';
import { MOVIE_GENRES, RELEASE_TYPES } from '@/lib/constants';
import { getTmdbImage } from '@/lib/utils';
import { Route as MovieIdRoute } from '@/routes/movies_.$movieId';
import { infiniteQueryOptions, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Link, createFileRoute, retainSearchParams, stripSearchParams, useNavigate } from '@tanstack/react-router';
import { fallback, zodSearchValidator } from '@tanstack/router-zod-adapter';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { ArrowDownIcon, ArrowUpIcon, CameraOffIcon, FilterXIcon } from 'lucide-react';
import React, { Suspense } from 'react';
import { z } from 'zod';

const defaultSearch = {
  adult: false,
  ratingMin: 1,
  ratingMax: 10,
  sort: 'popularity',
  sortDir: 'desc',
  genres: [] as string[],
  releaseTypes: [] as string[],
} as const;

const MovieSearchSchema = z.object({
  adult: fallback(z.boolean(), defaultSearch.adult).default(defaultSearch.adult),
  ratingMin: fallback(z.number().min(1).max(10), defaultSearch.ratingMin).default(defaultSearch.ratingMin),
  ratingMax: fallback(z.number().min(1).max(10), defaultSearch.ratingMax).default(defaultSearch.ratingMax),
  sort: fallback(
    z.enum(['vote_average', 'primary_release_date', 'revenue', 'popularity', 'title', 'vote_count']),
    defaultSearch.sort,
  ).default(defaultSearch.sort),
  sortDir: fallback(z.enum(['asc', 'desc']), defaultSearch.sortDir).default(defaultSearch.sortDir),
  genres: fallback(z.array(z.string()), defaultSearch.genres).default(defaultSearch.genres),
  releaseTypes: fallback(z.array(z.string()), defaultSearch.releaseTypes).default(defaultSearch.releaseTypes),
});

type Params = z.infer<typeof MovieSearchSchema>;

const movieQueryOptions = (params: Params) =>
  infiniteQueryOptions({
    queryKey: ['movies', params],
    queryFn: async ({ pageParam }) => {
      const pagesToFetch = [pageParam, pageParam + 1, pageParam + 2];
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      const responses = await Promise.all(
        pagesToFetch.map((page) =>
          movieApi('/discover/movie', {
            query: {
              page,
              include_adult: params.adult,
              'vote_average.gte': params.ratingMin,
              'vote_average.lte': params.ratingMax,
              sort_by: `${params.sort}.${params.sortDir}`,
              with_genres: params.genres.join(','),
              with_release_type: params.releaseTypes.join('|'),
            },
          }),
        ),
      );

      const lastResponse = responses.at(-1);
      return {
        page: lastResponse?.page ?? 0,
        results: responses.flatMap(({ results }) => results),
        totalPages: lastResponse?.total_pages ?? 0,
        totalResults: lastResponse?.total_results ?? 0,
      };
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
  });

export const Route = createFileRoute('/movies')({
  loaderDeps: ({ search }) => search,
  validateSearch: zodSearchValidator(MovieSearchSchema),
  search: {
    middlewares: [stripSearchParams(defaultSearch), retainSearchParams(true)],
  },
  // loader: ({ context: { queryClient }, deps }) => queryClient.ensureInfiniteQueryData(movieQueryOptions(deps)),
  // pendingMs: 0,
  // pendingComponent: () => (
  //   <div className="flex-1 overflow-y-auto p-4 pt-0">
  //     <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
  //       {Array.from({ length: 60 }).map((_, index) => (
  //         <Skeleton className="aspect-[2/3] w-full border border-gray-6" key={`placeholder-${index}`} />
  //       ))}
  //     </div>
  //   </div>
  // ),
  component: Movies,
});

function Movies() {
  return (
    <>
      <FilterSidebar />
      <main className="flex-1 overflow-y-auto p-4 pt-0">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
          <Suspense fallback={<SkeletonCards />}>
            <MovieCards />
          </Suspense>
        </div>
      </main>
    </>
  );
}

function SkeletonCards() {
  return Array.from({ length: 60 }).map((_, index) => (
    <Skeleton className="aspect-[2/3] w-full border border-gray-6" key={`placeholder-${index}`} />
  ));
}

function FilterSidebar() {
  const { adult, ratingMin, ratingMax, sort, sortDir, genres, releaseTypes } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [rating, setRating] = React.useState([ratingMin, ratingMax]);

  return (
    <aside className="mb-4 ml-4 flex w-64 flex-col overflow-y-auto rounded-xl border border-gray-5 bg-gray-2 p-4">
      <h2 className="mb-4 font-semibold text-lg">Filters</h2>

      <div className="flex flex-1 flex-col gap-6">
        {/* Rating */}
        <div className="flex flex-col gap-1.5">
          <Label>Rating</Label>
          <Slider
            className="mt-1"
            value={rating}
            onValueChange={setRating}
            onValueCommit={([ratingMin, ratingMax]) => navigate({ search: { ratingMin, ratingMax } })}
            defaultValue={[1, 10]}
            min={1}
            max={10}
            step={1}
            minStepsBetweenThumbs={1}
          />
          <div className="mt-1 flex justify-between text-sm">
            <span>1</span>
            <span>10</span>
          </div>
        </div>

        {/* Sort dropdown*/}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sort">Sort By</Label>
          <div className="flex gap-2">
            <Select
              defaultValue="popularity"
              value={sort}
              onValueChange={(sort: Params['sort']) => navigate({ search: { sort } })}
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
            onChange={(options) => navigate({ search: { genres: options.map(({ value }) => value) } })}
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
            onChange={(options) => navigate({ search: { releaseTypes: options.map(({ value }) => value) } })}
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

      <Link to="/movies" search={defaultSearch}>
        <Button asChild className="w-full" variant="secondary">
          <FilterXIcon className="mr-2 size-5" />
          Clear
        </Button>
      </Link>
    </aside>
  );
}

function MovieCards() {
  const deps = Route.useLoaderDeps();
  const [loadMoreRef, entry] = useIntersectionObserver();

  const {
    data: movies,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(movieQueryOptions(deps));

  React.useEffect(() => {
    if (entry?.isIntersecting && !isFetchingNextPage && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, isFetchingNextPage, hasNextPage]);

  return (
    <>
      {movies.pages.map((page) => (
        <React.Fragment key={page.page}>
          {page.results.map((movie) => (
            <Link
              key={movie.id}
              className="group relative grid aspect-[2/3] place-items-center overflow-hidden rounded-lg border border-gray-6 bg-gray-3 transition-all hover:scale-105 hover:border-gray-9"
              to={MovieIdRoute.to}
              params={{ movieId: movie.id.toString() }}
              preloadDelay={500}
            >
              {movie.poster_path ? (
                <img
                  src={getTmdbImage('poster', movie.poster_path, 'w342')}
                  alt={`Movie poster for ${movie.title}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <CameraOffIcon className="size-8 text-gray-9" />
              )}
              <div className="absolute inset-0 bg-gray-900/50 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                <div className="font-bold text-white text-xl">{movie.title}</div>
                <div className="line-clamp-3 text-sm text-white">{movie.overview}</div>
              </div>
            </Link>
          ))}
        </React.Fragment>
      ))}

      {isFetchingNextPage &&
        Array.from({ length: 60 }).map((_, index) => (
          <Skeleton className="aspect-[2/3] w-full border border-gray-6" key={`placeholder-${index}`} />
        ))}

      <div ref={loadMoreRef} className="h-1" />
    </>
  );
}
