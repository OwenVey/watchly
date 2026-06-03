import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import * as v from 'valibot';
import { PaddedLayout } from '@/components/padded-layout';
import { SeriesCard } from '@/components/series-card';
import { seriesIdQueryOptions } from '@/query-options';

export const Route = createFileRoute('/(series)/series_/$seriesId_/recommendations')({
  params: {
    parse: (params) => v.parse(v.object({ seriesId: v.pipe(v.string(), v.toNumber()) }), params),
    stringify: (params) => ({ seriesId: params.seriesId.toString() }),
  },
  loader: ({ context, params }) => context.queryClient.ensureQueryData(seriesIdQueryOptions(params.seriesId)),
  component: Recommendations,
});

function Recommendations() {
  const { seriesId } = Route.useParams();
  const { data: series } = useSuspenseQuery(seriesIdQueryOptions(seriesId));

  return (
    <PaddedLayout>
      <h1 className="text-2xl font-semibold text-foreground">Recommendations</h1>
      <h2 className="text-muted-foreground">{series.name}</h2>
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
        {series.recommendations.results.map((s) => (
          <SeriesCard key={s.id} series={s} />
        ))}
      </div>
    </PaddedLayout>
  );
}
