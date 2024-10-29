import { TmdbLogo } from '@/components/tmdb-logo';
import { cn, getTmdbImage } from '@/lib/utils';
import { Route as MovieIdRoute } from '@/routes/(movies)/movies_/$movieId';
import type { Movie } from '@/types';
import { Link } from '@tanstack/react-router';

type Props = {
  movie: Movie;
  className?: string;
  showBadge?: boolean;
};

export function MovieCard({ movie, className, showBadge = false }: Props) {
  return (
    <Link
      key={movie.id}
      className={cn(
        'group relative isolate grid aspect-2/3 place-items-center overflow-hidden rounded-lg border border-gray-5 bg-gray-3 transition-all hover:scale-105 hover:border-gray-7',
        className,
      )}
      to={MovieIdRoute.to}
      params={{ movieId: movie.id.toString() }}
      preloadDelay={500}
    >
      {showBadge && (
        <span className="absolute top-0 right-0 z-10 m-2 rounded-full border border-blue-9 bg-blue-11 px-2 py-0.5 text-xs font-semibold tracking-wide text-blue-1">
          MOVIE
        </span>
      )}

      {movie.poster_path && (
        <img
          src={getTmdbImage('poster', movie.poster_path, 'w342')}
          alt={`Movie poster for ${movie.title}`}
          className="h-full w-full object-cover"
        />
      )}
      <div
        className={cn(
          'absolute inset-0 flex flex-col justify-end p-2',
          movie.poster_path && 'bg-black/50 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100',
        )}
      >
        {movie.vote_average ? (
          <div className="absolute top-2 left-2 flex items-center gap-1">
            <TmdbLogo className="size-6" />
            <span className="text-xs font-medium text-white">{movie.vote_average}</span>
          </div>
        ) : null}
        {movie.release_date && <div className="text-sm font-medium text-white">{movie.release_date.getFullYear()}</div>}
        <div className="text-lg leading-6 font-bold text-balance text-white">{movie.title}</div>
        <div className="line-clamp-3 text-sm text-balance text-white/70">{movie.overview}</div>
      </div>
    </Link>
  );
}
