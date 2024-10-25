import { Image } from '@/components/image';
import { TmdbLogo } from '@/components/tmdb-logo';
import { cn, getTmdbImage } from '@/lib/utils';
import { Route as MovieIdRoute } from '@/routes/(movies)/movies_.$movieId.js';
import type { Movie } from '@/types';
import { Link } from '@tanstack/react-router';

export function MovieCard({ movie, className }: { movie: Movie; className?: string }) {
  return (
    <Link
      key={movie.id}
      className={cn(
        'group relative grid aspect-2/3 h-full place-items-center overflow-hidden rounded-lg border border-gray-5 bg-gray-3 transition-all hover:scale-105 hover:border-gray-7',
        className,
      )}
      to={MovieIdRoute.to}
      params={{ movieId: movie.id.toString() }}
      preloadDelay={500}
    >
      {movie.poster_path && (
        <Image
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
        <div className="text-balance text-lg font-bold leading-6 text-white">{movie.title}</div>
        <div className="line-clamp-3 text-balance text-sm text-white/70">{movie.overview}</div>
      </div>
    </Link>
  );
}
