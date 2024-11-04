import { MovieCard } from '@/components/movie-card';
import { PaddedLayout } from '@/components/padded-layout';
import { Badge } from '@/components/ui/badge';
import { tmdbApi } from '@/lib/api';
import { MOVIE_GENRES_MAP } from '@/lib/constants';
import { getTmdbImage } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';
import { FilmIcon } from 'lucide-react';

export const Route = createFileRoute('/collections/$collectionId')({
  loader: async ({ params }) => tmdbApi('/collection/:collectionId', { params: { collectionId: params.collectionId } }),
  component: Collection,
});

function Collection() {
  const collection = Route.useLoaderData();

  return (
    <PaddedLayout>
      {collection.backdrop_path && (
        <div className="absolute top-0 right-0 left-0 -z-10">
          <img
            className="h-[45rem] w-full object-cover opacity-15 blur-sm"
            src={getTmdbImage('backdrop', collection.backdrop_path, 'w1280')}
            alt={`backdrop image for ${collection.name}`}
          />
          <div className="absolute right-0 -bottom-4 left-0 h-1/2 bg-gradient-to-t from-gray-1" />
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
          {collection.poster_path ? (
            <img
              className="w-48 rounded-xl shadow-lg"
              src={getTmdbImage('poster', collection.poster_path, 'w342')}
              alt={`collection poster for ${collection.name}`}
            />
          ) : (
            <div className="grid aspect-2/3 h-auto w-48 place-items-center rounded-xl bg-gray-3 shadow-lg">
              <div className="grid size-24 place-items-center rounded-full border border-gray-6 bg-gray-5">
                <FilmIcon className="size-8 text-gray-11" />
              </div>
            </div>
          )}
          <div className="flex max-w-md flex-col items-center md:items-baseline">
            <h1 className="text-center text-3xl font-bold text-gray-12 md:text-left">{collection.name}</h1>

            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-start">
              <div>{collection.parts.length} Movies</div>

              <div className="flex flex-wrap gap-1">
                {collection.parts.at(0)?.genre_ids.map((id) => (
                  <Badge key={id} asChild variant="secondary" hover>
                    <Link from={Route.fullPath} to="/movies" search={{ genres: [id] }}>
                      {MOVIE_GENRES_MAP[id as keyof typeof MOVIE_GENRES_MAP]}
                    </Link>
                  </Badge>
                ))}
              </div>
            </div>

            <p className="mt-4 text-balance text-gray-11 md:text-left">{collection.overview}</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-12">Movies</h2>
        <ul className="mt-2 grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
          {collection.parts
            .sort((a, b) => (a.release_date?.getTime() ?? Infinity) - (b.release_date?.getTime() ?? Infinity))
            .map((movie) => (
              <li key={movie.id}>
                <MovieCard movie={movie} />
              </li>
            ))}
        </ul>
      </div>
    </PaddedLayout>
  );
}
