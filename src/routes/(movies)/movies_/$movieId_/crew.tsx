import { PaddedLayout } from '@/components/padded-layout';
import { PersonCard } from '@/components/person-card';
import { movieIdQueryOptions } from '@/query-options';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(movies)/movies_/$movieId_/crew')({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(movieIdQueryOptions(params.movieId)),
  component: Crew,
});

function Crew() {
  const { movieId } = Route.useParams();
  const { data: movie } = useSuspenseQuery(movieIdQueryOptions(movieId));

  return (
    <PaddedLayout>
      <h1 className="text-2xl font-semibold text-gray-12">Crew</h1>
      <h2 className="text-gray-11">{movie.title}</h2>
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
        {movie.credits.crew.map((person) => (
          <PersonCard key={person.id} person={person} title={person.job} />
        ))}
      </div>
    </PaddedLayout>
  );
}
