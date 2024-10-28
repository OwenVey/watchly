import { Logo } from '@/components/logo';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DEFAULT_MOVIE_SEARCH } from '@/routes/(movies)/_sidebar/movies';
import * as Accordion from '@radix-ui/react-accordion';
import { Link } from '@tanstack/react-router';
import { FilmIcon, MenuIcon, TvIcon, UsersIcon, XIcon } from 'lucide-react';

const LINKS = [
  {
    to: '/movies',
    label: 'Movies',
    icon: FilmIcon,
    search: DEFAULT_MOVIE_SEARCH,
  },
  {
    to: '/tv',
    label: 'TV Shows',
    icon: TvIcon,
  },
  {
    to: '/people',
    label: 'People',
    icon: UsersIcon,
  },
];

export function Navbar() {
  return (
    <Accordion.Root type="single" collapsible asChild>
      <Accordion.Item value="nav" asChild>
        <nav className="group sticky top-0 z-10 p-4 pb-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-1 from-[1rem]" />
          <Card className="px-4 py-3">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-gray-12">
                <Logo className="size-8 text-primary-9" />
                Watchly
              </Link>

              <div className="hidden items-center gap-4 text-sm md:flex">
                {LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    search={link.search}
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-11 transition-all hover:bg-gray-4 hover:text-gray-12"
                    activeProps={{ className: 'bg-primary-9 text-white hover:bg-primary-9' }}
                  >
                    <link.icon className="size-5" />
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="hidden md:block">
                <ModeToggle />
              </div>

              <Accordion.Header className="md:hidden">
                <Accordion.Trigger asChild>
                  <Button variant="ghost" size="icon" className="group text-gray-11 hover:text-gray-12 [&_svg]:size-6">
                    <XIcon className="hidden group-data-[state=open]:block" />
                    <MenuIcon className="block group-data-[state=open]:hidden" />
                  </Button>
                </Accordion.Trigger>
              </Accordion.Header>
            </div>

            <Accordion.Content className="mt-3 space-y-1 md:hidden">
              {LINKS.map((link) => (
                <Accordion.Trigger key={link.to} asChild>
                  <Link
                    to={link.to}
                    search={link.search}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-gray-11 hover:bg-gray-10/20 hover:text-gray-12"
                    activeProps={{ className: 'bg-primary-9 text-white hover:bg-primary-9 hover:text-white' }}
                  >
                    <link.icon className="size-6" />
                    {link.label}
                  </Link>
                </Accordion.Trigger>
              ))}
            </Accordion.Content>
          </Card>
        </nav>
      </Accordion.Item>
    </Accordion.Root>
  );
}
