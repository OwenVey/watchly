import { PersonCard } from '@/components/person-card';
import { movieIdQueryOptions } from '@/routes/(movies)/movies_/_padded/$movieId';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(movies)/movies_/_padded/$movieId_/cast')({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(movieIdQueryOptions(params.movieId)),
  component: Cast,
});

function Cast() {
  const { movieId } = Route.useParams();
  const { data: movie } = useSuspenseQuery(movieIdQueryOptions(movieId));

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-12">Cast</h1>
      <h2 className="text-gray-11">{movie.title}</h2>
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
        {movie.credits.cast.map((person) => (
          <PersonCard key={person.id} name={person.name} role={person.character} profilePath={person.profile_path} />
        ))}
      </div>
    </>
  );
}
