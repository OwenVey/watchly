import { movieIdQueryOptions } from '@/routes/(movies)/movies_/$movieId';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(movies)/movies_/$movieId_/cast')({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(movieIdQueryOptions(params.movieId)),
  component: Cast,
});

function Cast() {
  const { movieId } = Route.useParams();
  const { data: movie } = useSuspenseQuery(movieIdQueryOptions(movieId));

  return <div>Cast for {movie.title}</div>;
}
