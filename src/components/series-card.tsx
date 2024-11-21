import { TmdbLogo } from '@/components/tmdb-logo';
import { cn, getTmdbImage } from '@/lib/utils';
import { Route as SeriesIdRoute } from '@/routes/(series)/series_/$seriesId';
import type { Series } from '@/types';
import { Link } from '@tanstack/react-router';

type Props = {
  series: Series;
  className?: string;
  showBadge?: boolean;
};

export function SeriesCard({ series, className, showBadge = false }: Props) {
  return (
    <Link
      key={series.id}
      className={cn(
        'group relative isolate grid aspect-2/3 place-items-center overflow-hidden rounded-lg border border-gray-5 bg-[#222] transition-all hover:scale-105 hover:border-gray-7',
        className,
      )}
      to={SeriesIdRoute.to}
      params={{ seriesId: series.id.toString() }}
      preloadDelay={500}
    >
      {showBadge && (
        <span className="absolute top-0 right-0 z-10 m-2 rounded-full border border-purple-9 bg-purple-11 px-2 py-0.5 text-xs font-semibold tracking-wide text-purple-1">
          SERIES
        </span>
      )}

      {series.poster_path && (
        <img
          src={getTmdbImage('poster', series.poster_path, 'w342')}
          alt={`Movie poster for ${series.name}`}
          className="h-full w-full object-cover"
        />
      )}
      <div
        className={cn(
          'absolute inset-0 flex flex-col justify-end p-2',
          series.poster_path && 'bg-black/50 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100',
        )}
      >
        {series.vote_average ? (
          <div className="absolute top-2 left-2 flex items-center gap-1">
            <TmdbLogo className="size-6" />
            <span className="text-xs font-medium text-white">{series.vote_average}</span>
          </div>
        ) : null}
        {series.first_air_date && (
          <div className="text-sm font-medium text-white">{series.first_air_date.getFullYear()}</div>
        )}
        <div className="text-lg leading-6 font-bold text-balance text-white">{series.name}</div>
        <div className="line-clamp-3 text-sm text-balance text-white/70">{series.overview}</div>
      </div>
    </Link>
  );
}
