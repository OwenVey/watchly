import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { PaddedLayout } from '@/components/padded-layout';
import { PersonCard } from '@/components/person-card';
import { seriesIdQueryOptions } from '@/query-options';

export const Route = createFileRoute('/(series)/series_/$seriesId_/cast')({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(seriesIdQueryOptions(params.seriesId)),
  component: Cast,
});

function Cast() {
  const { seriesId } = Route.useParams();
  const { data: series } = useSuspenseQuery(seriesIdQueryOptions(seriesId));

  return (
    <PaddedLayout>
      <h1 className="text-2xl font-semibold text-gray-12">Cast</h1>
      <h2 className="text-gray-11">{series.name}</h2>
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
        {series.credits.cast.map((person) => (
          <PersonCard key={person.id} person={person} title={person.character} />
        ))}
      </div>
    </PaddedLayout>
  );
}
