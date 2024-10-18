import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { movieApi } from '@/lib/api';
import { getTmdbImage } from '@/lib/utils';
import { Route as MovieIdRoute } from '@/routes/movies_.$movieId';
import { infiniteQueryOptions, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Link, createFileRoute, retainSearchParams, useNavigate } from '@tanstack/react-router';
import { fallback, zodSearchValidator } from '@tanstack/router-zod-adapter';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { ArrowDownIcon, ArrowUpIcon, CameraOffIcon } from 'lucide-react';
import React from 'react';
import { z } from 'zod';

const MovieSearchSchema = z.object({
  adult: fallback(z.boolean(), false).default(false),
  ratingMin: fallback(z.number().min(1).max(10), 1).default(1),
  ratingMax: fallback(z.number().min(1).max(10), 10).default(10),
  sort: fallback(
    z.enum(['vote_average', 'primary_release_date', 'revenue', 'popularity', 'title', 'vote_count']),
    'popularity',
  ).default('popularity'),
  sortDir: fallback(z.enum(['asc', 'desc']), 'desc').default('desc'),
});
type Params = z.infer<typeof MovieSearchSchema>;

const movieQueryOptions = (params: Params) =>
  infiniteQueryOptions({
    queryKey: ['movies', params],
    queryFn: async ({ pageParam }) => {
      const pagesToFetch = [pageParam, pageParam + 1, pageParam + 2];
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const responses = await Promise.all(
        pagesToFetch.map((page) =>
          movieApi('/discover/movie', {
            query: {
              page,
              include_adult: params.adult,
              'vote_average.gte': params.ratingMin,
              'vote_average.lte': params.ratingMax,
              sort_by: `${params.sort}.${params.sortDir}`,
            },
          }),
        ),
      );

      return {
        page: responses.at(-1)?.page ?? 0,
        results: responses.flatMap((f) => f.results),
      };
    },
    initialPageParam: 1,
    getPreviousPageParam: (firstPage) => firstPage.page - 1,
    getNextPageParam: (lastPage) => lastPage.page + 1,
  });

export const Route = createFileRoute('/movies')({
  loaderDeps: ({ search }) => search,
  loader: ({ context: { queryClient }, deps }) => queryClient.ensureInfiniteQueryData(movieQueryOptions(deps)),
  validateSearch: zodSearchValidator(MovieSearchSchema),
  search: {
    middlewares: [retainSearchParams(true)],
  },
  component: Movies,
});

function Movies() {
  const deps = Route.useLoaderDeps();
  const navigate = useNavigate({ from: Route.fullPath });

  const [rating, setRating] = React.useState([deps.ratingMin, deps.ratingMax]);

  const [loadMoreRef, entry] = useIntersectionObserver();

  React.useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry]);

  const {
    data: movies,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(movieQueryOptions(deps));

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar with filters */}
      <aside className="ml-4 mb-4 w-64 overflow-y-auto rounded-xl border border-gray-5 bg-gray-2 p-4">
        <h2 className="mb-4 font-semibold text-lg">Filters</h2>

        <div className="flex flex-col gap-4">
          {/* Rating */}
          <div className="">
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
          <div>
            <Label htmlFor="sort">Sort By</Label>
            <div className="flex gap-2">
              <Select
                defaultValue="popularity"
                value={deps.sort}
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

              <Link to="." search={{ sortDir: deps.sortDir === 'asc' ? 'desc' : 'asc' }}>
                <Button asChild className="shrink-0" size="icon" variant="outline">
                  {deps.sortDir === 'asc' ? <ArrowUpIcon className="size-5" /> : <ArrowDownIcon className="size-5" />}
                </Button>
              </Link>
            </div>
          </div>

          {/* Adult Content */}
          <div className="flex items-center space-x-2">
            <Switch
              id="adult-content"
              checked={deps.adult}
              onCheckedChange={(adult) => navigate({ search: { adult } })}
            />
            <Label htmlFor="adult-content">Include Adult Content</Label>
          </div>
        </div>
      </aside>

      {/* Results area */}
      <main className="flex-1 overflow-y-auto p-4 pt-0">
        {/* Grid of movie/show results */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
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
              <Skeleton
                className="aspect-[2/3] w-full border border-gray-6"
                key={`placeholder-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  index
                }`}
              />
            ))}
        </div>

        <div ref={loadMoreRef} className="h-1" />
      </main>
    </div>
  );
}
