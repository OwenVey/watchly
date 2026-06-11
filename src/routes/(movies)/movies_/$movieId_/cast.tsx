import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import * as v from 'valibot';
import { PaddedLayout } from '@/components/padded-layout';
import { PersonCard } from '@/components/person-card';
import { GridPending } from '@/components/route-pending';
import { movieIdQueryOptions } from '@/query-options';
import { MovieIdParamsSchema } from '@/schemas';

export const Route = createFileRoute('/(movies)/movies_/$movieId_/cast')({
  params: {
    parse: (params) => v.parse(MovieIdParamsSchema, params),
    stringify: (params) => ({ movieId: params.movieId.toString() }),
  },

  loader: ({ context, params }) => context.queryClient.prefetchQuery(movieIdQueryOptions(params.movieId)),
  pendingMs: 0,
  pendingComponent: GridPending,
  component: Cast,
});

function Cast() {
  const { movieId } = Route.useParams();
  const { data: movie } = useSuspenseQuery(movieIdQueryOptions(movieId));

  return (
    <PaddedLayout>
      <h1 className="text-2xl font-semibold text-foreground">Cast</h1>
      <h2 className="text-muted-foreground">{movie.title}</h2>
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
        {movie.credits.cast.map((person) => (
          <PersonCard key={person.id} person={person} title={person.character} />
        ))}
      </div>
    </PaddedLayout>
  );
}
