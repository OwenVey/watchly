import { Logo } from '@/components/logo';
import { ModeToggle } from '@/components/mode-toggle';
import { DEFAULT_MOVIE_SEARCH as defaultMovieSearch } from '@/routes/(movies)/_layout.movies.js';
import { Link } from '@tanstack/react-router';
import { FilmIcon, TvIcon } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="bg-background m-4 mb-0 flex items-center justify-between rounded-xl border border-gray-5 bg-gray-2 p-4">
      <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-gray-12">
        <Logo className="size-8 text-primary-9" />
        Watchly
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <Link
          to="/movies"
          search={defaultMovieSearch}
          className="flex items-center gap-2 rounded-md py-2 px-4 text-sm font-medium text-gray-11 transition-all hover:bg-gray-4 hover:text-gray-12 data-[status]:bg-primary-9 data-[status]:text-white"
        >
          <FilmIcon className="size-5" />
          Movies
        </Link>
        <Link
          to="/tv"
          className="flex items-center gap-2 rounded-md py-2 px-4 text-sm font-medium text-gray-11 transition-all hover:bg-gray-4 hover:text-gray-12 data-[status]:bg-primary-9 data-[status]:text-white"
        >
          <TvIcon className="size-5" />
          TV Shows
        </Link>
      </div>

      <div>
        <ModeToggle />
      </div>
    </nav>
  );
}
