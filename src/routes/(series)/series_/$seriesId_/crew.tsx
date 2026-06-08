import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import * as v from 'valibot';
import { PaddedLayout } from '@/components/padded-layout';
import { PersonCard } from '@/components/person-card';
import { GridPending } from '@/components/route-pending';
import { seriesIdQueryOptions } from '@/query-options';
import { SeriesIdParamsSchema } from '@/schemas';

export const Route = createFileRoute('/(series)/series_/$seriesId_/crew')({
  params: {
    parse: (params) => v.parse(SeriesIdParamsSchema, params),
    stringify: (params) => ({ seriesId: params.seriesId.toString() }),
  },

  loader: ({ context, params }) => context.queryClient.ensureQueryData(seriesIdQueryOptions(params.seriesId)),
  pendingMs: 0,
  pendingComponent: GridPending,
  component: Crew,
});

function Crew() {
  const { seriesId } = Route.useParams();
  const { data: series } = useSuspenseQuery(seriesIdQueryOptions(seriesId));

  return (
    <PaddedLayout>
      <h1 className="text-2xl font-semibold text-foreground">Crew</h1>
      <h2 className="text-muted-foreground">{series.name}</h2>
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
        {series.credits.crew.map((person) => (
          <PersonCard key={person.id} person={person} title={person.job} />
        ))}
      </div>
    </PaddedLayout>
  );
}
