import type { MovieResultItem } from '@lorenzopant/tmdb';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { TmdbLogo } from '@/components/tmdb-logo';
import { cn, getTmdbImage, voteAverageToPercentage } from '@/lib/utils';
import { Route as MovieIdRoute } from '@/routes/(movies)/movies_/$movieId';

interface Props {
  movie: MovieResultItem;
  className?: string;
  showBadge?: boolean;
}

export function MovieCard({ movie, className, showBadge = false }: Props) {
  const [isTransitionTarget, setIsTransitionTarget] = useState(false);
  const posterTransitionName = `movie-poster-${movie.id}`;

  return (
    <Link
      key={movie.id}
      className={cn(
        'group relative isolate grid aspect-2/3 place-items-center overflow-hidden rounded-lg border bg-card transition-all hover:scale-105 hover:border-accent',
        className,
      )}
      to={MovieIdRoute.to}
      params={{ movieId: movie.id }}
      preloadDelay={500}
      viewTransition
      onClick={() => {
        setIsTransitionTarget(true);
      }}
    >
      {showBadge && (
        <span className="text-blue-1 absolute top-0 right-0 z-10 m-2 rounded-full border border-blue-400 bg-blue-600 px-2 py-0.5 text-xs font-semibold tracking-wide">
          MOVIE
        </span>
      )}

      {movie.poster_path && (
        <img
          src={getTmdbImage('poster', movie.poster_path, 'w342')}
          alt={`Movie poster for ${movie.title}`}
          className="h-full w-full object-cover"
          style={{
            viewTransitionName: isTransitionTarget ? posterTransitionName : 'none',
          }}
        />
      )}
      <div
        className={cn(
          'absolute inset-0 flex flex-col justify-end p-2',
          movie.poster_path && 'bg-black/50 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100',
        )}
      >
        <div className="absolute top-2 left-2 flex items-center gap-1">
          <TmdbLogo className="size-6" />
          <span className="text-xs font-medium text-white">{voteAverageToPercentage(movie.vote_average)}</span>
        </div>

        {movie.release_date && (
          <div className="text-sm font-medium text-white">{new Date(movie.release_date).getFullYear()}</div>
        )}
        <div className="text-lg leading-6 font-bold text-balance text-white">{movie.title}</div>
        <div className="line-clamp-3 text-sm text-balance text-white/70">{movie.overview}</div>
      </div>
    </Link>
  );
}
