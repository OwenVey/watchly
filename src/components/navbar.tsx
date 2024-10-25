import { Logo } from '@/components/logo';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { DEFAULT_MOVIE_SEARCH as defaultMovieSearch } from '@/routes/(movies)/_layout.movies.js';
import * as Accordion from '@radix-ui/react-accordion';
import { Link } from '@tanstack/react-router';
import { FilmIcon, MenuIcon, TvIcon, XIcon } from 'lucide-react';

export function Navbar() {
  return (
    <Accordion.Root type="single" collapsible asChild>
      <Accordion.Item value="nav" asChild>
        <nav className="group sticky top-0 z-10 p-4 pb-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-1 from-[1rem]" />
          <div className="rounded-xl border border-gray-11/15 bg-gray-3/60 py-3 px-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-gray-12">
                <Logo className="size-8 text-primary-9" />
                Watchly
              </Link>

              <div className="hidden items-center gap-4 text-sm sm:flex">
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

              <div className="hidden sm:block">
                <ModeToggle />
              </div>

              <Accordion.Header className="sm:hidden">
                <Accordion.Trigger asChild>
                  <Button variant="ghost" size="icon" className="group text-gray-11 hover:text-gray-12 [&_svg]:size-6">
                    <XIcon className="hidden group-data-[state=open]:block" />
                    <MenuIcon className="block group-data-[state=open]:hidden" />
                  </Button>
                </Accordion.Trigger>
              </Accordion.Header>
            </div>

            <Accordion.Content className="mt-3 space-y-1 sm:hidden">
              <Accordion.Trigger asChild>
                <Link
                  className="bg flex items-center gap-3 rounded-lg py-2 px-3 text-base font-medium text-gray-11 hover:bg-gray-10/20 hover:text-gray-12"
                  activeProps={{ className: 'bg-primary-9 text-white hover:bg-primary-9 hover:text-white' }}
                  to="/movies"
                  search={defaultMovieSearch}
                >
                  <FilmIcon className="size-6" />
                  Movies
                </Link>
              </Accordion.Trigger>

              <Accordion.Trigger asChild>
                <Link
                  className="bg flex items-center gap-3 rounded-lg py-2 px-3 text-base font-medium text-gray-11 hover:bg-gray-10/20 hover:text-gray-12"
                  activeProps={{ className: 'bg-primary-9 text-white hover:bg-primary-9 hover:text-white' }}
                  to="/tv"
                >
                  <TvIcon className="size-6" />
                  TV Shows
                </Link>
              </Accordion.Trigger>
            </Accordion.Content>
          </div>
        </nav>
      </Accordion.Item>
    </Accordion.Root>
  );
}
