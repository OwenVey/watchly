import { movieApi } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/movies/$movieId')({
  loader: async ({ params }) => {
    return movieApi('/movie/:movieId', { params });
  },
  component: Movie,
});

function Movie() {
  const movie = Route.useLoaderData();

  return <pre className="text-xs">{JSON.stringify(movie, null, 2)}</pre>;
}
