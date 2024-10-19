import {} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { movieApi } from '@/lib/api';
import {} from '@/lib/constants';
import { getTmdbImage } from '@/lib/utils';
import { Route as MovieIdRoute } from '@/routes/(movies)/movies_.$movieId.js';
import { infiniteQueryOptions, useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Link, createFileRoute, retainSearchParams, stripSearchParams } from '@tanstack/react-router';
import { fallback, zodSearchValidator } from '@tanstack/router-zod-adapter';
import { useIntersectionObserver } from '@uidotdev/usehooks';
import { CameraOffIcon } from 'lucide-react';
import React from 'react';
import { z } from 'zod';

export const DEFAULT_MOVIE_SEARCH = {
  ratingMin: 0,
  ratingMax: 10,
  voteCountMin: 0,
  voteCountMax: 50_000,
  sort: 'popularity',
  sortDir: 'desc',
  genres: [] as string[],
  releaseTypes: [] as string[],
  adult: false,
} as const;

const MovieSearchSchema = z.object({
  ratingMin: fallback(
    z
      .number()
      .min(1)
      .max(DEFAULT_MOVIE_SEARCH.ratingMax - 1),
    DEFAULT_MOVIE_SEARCH.ratingMin,
  ).default(DEFAULT_MOVIE_SEARCH.ratingMin),
  ratingMax: fallback(z.number().min(1).max(DEFAULT_MOVIE_SEARCH.ratingMax), DEFAULT_MOVIE_SEARCH.ratingMax).default(
    DEFAULT_MOVIE_SEARCH.ratingMax,
  ),
  voteCountMin: fallback(
    z
      .number()
      .min(1)
      .max(DEFAULT_MOVIE_SEARCH.voteCountMax - 1),
    DEFAULT_MOVIE_SEARCH.voteCountMin,
  ).default(DEFAULT_MOVIE_SEARCH.voteCountMin),
  voteCountMax: fallback(
    z.number().min(1).max(DEFAULT_MOVIE_SEARCH.voteCountMax),
    DEFAULT_MOVIE_SEARCH.voteCountMax,
  ).default(DEFAULT_MOVIE_SEARCH.voteCountMax),
  sort: fallback(
    z.enum(['vote_average', 'primary_release_date', 'revenue', 'popularity', 'title', 'vote_count']),
    DEFAULT_MOVIE_SEARCH.sort,
  ).default(DEFAULT_MOVIE_SEARCH.sort),
  sortDir: fallback(z.enum(['asc', 'desc']), DEFAULT_MOVIE_SEARCH.sortDir).default(DEFAULT_MOVIE_SEARCH.sortDir),
  genres: fallback(z.array(z.string()), DEFAULT_MOVIE_SEARCH.genres).default(DEFAULT_MOVIE_SEARCH.genres),
  releaseTypes: fallback(z.array(z.string()), DEFAULT_MOVIE_SEARCH.releaseTypes).default(
    DEFAULT_MOVIE_SEARCH.releaseTypes,
  ),
  adult: fallback(z.boolean(), DEFAULT_MOVIE_SEARCH.adult).default(DEFAULT_MOVIE_SEARCH.adult),
});

export type MovieSearchParams = z.infer<typeof MovieSearchSchema>;

const movieQueryOptions = (params: MovieSearchParams) =>
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
              ...(params.ratingMin !== DEFAULT_MOVIE_SEARCH.ratingMin && {
                'vote_average.gte': params.ratingMin,
              }),
              ...(params.ratingMax !== DEFAULT_MOVIE_SEARCH.ratingMax && {
                'vote_average.lte': params.ratingMax,
              }),
              ...(params.voteCountMin !== DEFAULT_MOVIE_SEARCH.voteCountMin && {
                'vote_count.gte': params.voteCountMin,
              }),
              ...(params.voteCountMax !== DEFAULT_MOVIE_SEARCH.voteCountMax && {
                'vote_count.lte': params.voteCountMax,
              }),
              ...((params.sort !== DEFAULT_MOVIE_SEARCH.sort || params.sortDir !== DEFAULT_MOVIE_SEARCH.sortDir) && {
                sort_by: `${params.sort}.${params.sortDir}`,
              }),
              ...(params.genres.length > 0 && {
                with_genres: params.genres.join(','),
              }),
              ...(params.releaseTypes.length > 0 && {
                with_release_type: params.releaseTypes.join('|'),
              }),
              ...(params.adult !== DEFAULT_MOVIE_SEARCH.adult && {
                include_adult: params.adult,
              }),
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

export const Route = createFileRoute('/(movies)/_layout/movies')({
  loaderDeps: ({ search }) => search,
  validateSearch: zodSearchValidator(MovieSearchSchema),
  search: {
    middlewares: [stripSearchParams(DEFAULT_MOVIE_SEARCH), retainSearchParams(true)],
  },
  loader: ({ context: { queryClient }, deps }) => queryClient.ensureInfiniteQueryData(movieQueryOptions(deps)),
  pendingMs: 0,
  pendingComponent: SkeletonCards,
  component: MovieCards,
});

function SkeletonCards() {
  return Array.from({ length: 60 }).map((_, index) => (
    <Skeleton className="aspect-[2/3] w-full border border-gray-6" key={`placeholder-${index}`} />
  ));
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
