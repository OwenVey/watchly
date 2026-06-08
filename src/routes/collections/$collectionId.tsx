import { createFileRoute, Link } from '@tanstack/react-router';
import { FilmIcon } from 'lucide-react';
import * as v from 'valibot';
import { MovieCard } from '@/components/movie-card';
import { PaddedLayout } from '@/components/padded-layout';
import { DetailPending } from '@/components/route-pending';
import { Badge } from '@/components/ui/badge';
import { tmdbApi } from '@/lib/api';
import { MOVIE_GENRES_MAP } from '@/lib/constants';
import { CollectionIdParamsSchema } from '@/schemas';

export const Route = createFileRoute('/collections/$collectionId')({
  params: {
    parse: (params) => v.parse(CollectionIdParamsSchema, params),
    stringify: (params) => ({ collectionId: params.collectionId.toString() }),
  },

  loader: async ({ params }) => tmdbApi.collections.details({ collection_id: params.collectionId }),
  pendingMs: 0,
  pendingComponent: DetailPending,
  component: Collection,
});

function Collection() {
  const collection = Route.useLoaderData();

  return (
    <PaddedLayout>
      {collection.backdrop_path && (
        <div className="absolute top-0 right-0 left-0 -z-10">
          <img
            className="h-180 w-full object-cover opacity-15 blur-sm"
            src={collection.backdrop_path}
            alt={`backdrop for ${collection.name}`}
          />
          <div className="absolute right-0 -bottom-4 left-0 h-1/2 bg-linear-to-t from-background" />
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
          {collection.poster_path ? (
            <img
              className="w-48 rounded-xl shadow-lg"
              src={collection.poster_path}
              alt={`collection poster for ${collection.name}`}
            />
          ) : (
            <div className="grid aspect-2/3 h-auto w-48 place-items-center rounded-xl bg-card shadow-lg">
              <div className="grid size-24 place-items-center rounded-full border bg-accent">
                <FilmIcon className="size-8 text-muted-foreground" />
              </div>
            </div>
          )}
          <div className="flex max-w-md flex-col items-center md:items-baseline">
            <h1 className="text-center text-3xl font-bold text-foreground md:text-left">{collection.name}</h1>

            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-start">
              <div>{collection.parts.length} Movies</div>

              <div className="flex flex-wrap gap-1">
                {collection.parts.at(0)?.genre_ids.map((id) => (
                  <Badge
                    key={id}
                    variant="secondary"
                    render={
                      <Link from={Route.fullPath} to="/movies" search={{ genres: [id] }}>
                        {MOVIE_GENRES_MAP[id as keyof typeof MOVIE_GENRES_MAP]}
                      </Link>
                    }
                  />
                ))}
              </div>
            </div>

            <p className="mt-4 text-balance text-muted-foreground md:text-left">{collection.overview}</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-foreground">Movies</h2>
        <ul className="mt-2 grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
          {collection.parts
            .sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime())
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
