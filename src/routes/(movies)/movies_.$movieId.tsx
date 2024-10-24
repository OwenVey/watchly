import { Image } from '@/components/image';
import { tmdbApi } from '@/lib/api';
import { getTmdbImage } from '@/lib/utils';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(movies)/movies_/$movieId')({
  loader: async ({ params }) => {
    return tmdbApi('/movie/:movieId', {
      params,
      query: { append_to_response: ['recommendations', 'reviews', 'similar', 'credits'] },
    });
  },
  component: Movie,
});

function Movie() {
  const movie = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-5xl p-4">
      {movie.backdrop_path && (
        <div className="absolute top-0 right-0 left-0 -z-10">
          <Image
            className="h-96 w-full object-cover opacity-10"
            src={getTmdbImage('backdrop', movie.backdrop_path, 'w1280')}
            alt={`backdrop image for ${movie.title}`}
          />
          <div className="absolute right-0 bottom-0 left-0 h-1/4 bg-gradient-to-t from-gray-1" />
        </div>
      )}
      <h1>{movie.title}</h1>
      {movie.poster_path ? (
        <Image
          className="w-48 rounded"
          src={getTmdbImage('poster', movie.poster_path, 'w342')}
          alt={`movie poster for ${movie.title}`}
        />
      ) : (
        <div>no poster</div>
      )}
      <p>{movie.overview}</p>
      <pre className="text-xs">{JSON.stringify(movie, null, 2)}</pre>
    </div>
  );
}
