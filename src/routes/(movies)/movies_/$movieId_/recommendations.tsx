import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import * as v from 'valibot';
import { MovieCard } from '@/components/movie-card';
import { PaddedLayout } from '@/components/padded-layout';
import { movieIdQueryOptions } from '@/query-options';

export const Route = createFileRoute('/(movies)/movies_/$movieId_/recommendations')({
  params: {
    parse: (params) => v.parse(v.object({ movieId: v.pipe(v.string(), v.toNumber()) }), params),
    stringify: (params) => ({ movieId: params.movieId.toString() }),
  },
  loader: ({ context, params }) => context.queryClient.ensureQueryData(movieIdQueryOptions(params.movieId)),
  component: Recommendations,
});

function Recommendations() {
  const { movieId } = Route.useParams();
  const { data: movie } = useSuspenseQuery(movieIdQueryOptions(movieId));

  return (
    <PaddedLayout>
      <h1 className="text-2xl font-semibold text-foreground">Recommendations</h1>
      <h2 className="text-muted-foreground">{movie.title}</h2>
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
        {movie.recommendations.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </PaddedLayout>
  );
}
