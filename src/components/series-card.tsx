import type { TVSeriesResultItem } from '@lorenzopant/tmdb';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { TmdbLogo } from '@/components/logos/tmdb-logo';
import { formatCalendarYear } from '@/lib/date';
import { cn, voteAverageToPercentage } from '@/lib/utils';
import { Route as SeriesIdRoute } from '@/routes/(series)/series_/$seriesId';

interface Props {
  series: TVSeriesResultItem;
  className?: string;
  showBadge?: boolean;
  showName?: boolean;
  showRating?: boolean;
  showYear?: boolean;
}

export function SeriesCard({
  series,
  className,
  showBadge = false,
  showName = false,
  showRating = false,
  showYear = false,
}: Props) {
  const [isTransitionTarget, setIsTransitionTarget] = useState(false);

  const card = (
    <Link
      key={series.id}
      className={cn(
        'group relative isolate grid aspect-2/3 place-items-center overflow-hidden rounded-lg border bg-card transition-all hover:scale-105 hover:border-accent',
        className,
      )}
      to={SeriesIdRoute.to}
      params={{ seriesId: series.id }}
      preloadDelay={500}
      viewTransition
      onClick={() => {
        setIsTransitionTarget(true);
      }}
    >
      {showBadge && (
        <span className="text-purple-1 absolute top-0 right-0 z-10 m-2 rounded-full border border-purple-400 bg-purple-600 px-2 py-0.5 text-xs font-semibold tracking-wide">
          SERIES
        </span>
      )}

      {showRating && (
        <div className="group-hover: absolute top-1 left-1 z-10 flex items-center gap-1 rounded-md bg-black/50 px-1 backdrop-blur-sm transition-all group-hover:bg-transparent group-hover:backdrop-blur-none">
          <TmdbLogo className="size-6" />
          <span className="text-xs font-medium text-white">{voteAverageToPercentage(series.vote_average)}</span>
        </div>
      )}

      {series.poster_path && (
        <img
          src={series.poster_path}
          alt={`Series poster for ${series.name}`}
          className="h-full w-full object-cover"
          style={{
            viewTransitionName: isTransitionTarget ? `series-poster-${series.id}` : 'none',
          }}
        />
      )}
      <div
        className={cn(
          'absolute inset-0 flex flex-col justify-end p-2',
          series.poster_path && 'bg-black/50 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100',
        )}
      >
        {!showRating && (
          <div className="absolute top-2 left-2 flex items-center gap-1">
            <TmdbLogo className="size-6" />
            <span className="text-xs font-medium text-white">{voteAverageToPercentage(series.vote_average)}</span>
          </div>
        )}
        {!showYear && series.first_air_date && (
          <div className="text-sm font-medium text-white">{formatCalendarYear(series.first_air_date)}</div>
        )}
        <div className="text-lg leading-6 font-bold text-balance text-white">{series.name}</div>
        <div className="line-clamp-3 text-sm text-balance text-white/70">{series.overview}</div>
      </div>
    </Link>
  );

  if (!showName && !showYear) {
    return card;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {card}
      <div className="flex flex-col gap-0.5">
        {showYear && series.first_air_date && (
          <div className="text-xs text-muted-foreground">{formatCalendarYear(series.first_air_date)}</div>
        )}
        {showName && <div className="line-clamp-2 text-sm leading-snug font-medium text-foreground">{series.name}</div>}
      </div>
    </div>
  );
}
