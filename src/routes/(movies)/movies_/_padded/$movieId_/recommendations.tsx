import { createFileRoute } from '@tanstack/react-router';

import { MovieCard } from '@/components/movie-card';
import { movieIdQueryOptions } from '@/routes/(movies)/movies_/_padded/$movieId';
import { useSuspenseQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/(movies)/movies_/_padded/$movieId_/recommendations')({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(movieIdQueryOptions(params.movieId)),
  component: Crew,
});

function Crew() {
  const { movieId } = Route.useParams();
  const { data: movie } = useSuspenseQuery(movieIdQueryOptions(movieId));

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-12">Recommendations</h1>
      <h2 className="text-gray-11">{movie.title}</h2>
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] gap-4">
        {movie.recommendations.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </>
  );
}
