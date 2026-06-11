import { Accordion } from '@base-ui/react/accordion';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { FilmIcon, MenuIcon, SearchIcon, TrendingUpIcon, TvIcon, UsersIcon, XIcon } from 'lucide-react';
import { WatchlyLogo } from '@/components/logos/watchly-logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { DEFAULT_MOVIE_SEARCH, DEFAULT_SERIES_SEARCH } from '@/lib/constants';

const LINKS = [
  {
    icon: FilmIcon,
    label: 'Movies',
    to: '/movies',
    search: DEFAULT_MOVIE_SEARCH,
  },
  {
    icon: TvIcon,
    label: 'Series',
    to: '/series',
    search: DEFAULT_SERIES_SEARCH,
  },
  {
    icon: UsersIcon,
    label: 'People',
    to: '/people',
  },
  {
    icon: TrendingUpIcon,
    label: 'Trending',
    to: '/trending',
  },
];

export function Navbar() {
  const navigate = useNavigate();
  const query = useLocation({
    select: (location) => location.search.query ?? '',
  });

  return (
    <Accordion.Root className="group sticky top-0 z-10 p-4 pb-0">
      <Accordion.Item>
        <div className="absolute inset-0 -z-10 bg-linear-to-b from-background from-[1rem]" />
        <Card className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/"
                className="-m-1 flex items-center gap-2 rounded-lg p-1 text-lg font-semibold text-foreground"
              >
                <WatchlyLogo className="size-8 text-primary" />
                Watchly
              </Link>

              <div className="ml-8 hidden items-center gap-2 text-sm md:flex">
                {LINKS.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    search={link.search}
                    className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all"
                    inactiveProps={{
                      className: 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    }}
                    activeProps={{ className: 'bg-primary text-white' }}
                    activeOptions={{
                      includeSearch: false,
                    }}
                  >
                    <link.icon className="size-5" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-1 justify-center gap-2 md:justify-end">
              <InputGroup className="mr-6 ml-8 max-w-96 md:mr-0 md:ml-2 md:max-w-52">
                <InputGroupInput
                  value={query}
                  onChange={async (e) => {
                    await navigate({
                      replace: true,
                      search: { query: e.target.value },
                      to: '/search',
                    });
                  }}
                  id="inline-start-input"
                  placeholder="Search..."
                />
                <InputGroupAddon align="inline-start">
                  <SearchIcon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>

              <div className="hidden md:block">
                <ThemeToggle />
              </div>
            </div>

            <Accordion.Header className="md:hidden">
              <Accordion.Trigger
                render={
                  <Button variant="ghost" size="icon" className="group text-muted-foreground hover:text-foreground">
                    <XIcon className="hidden size-6 group-data-panel-open:block" />
                    <MenuIcon className="block size-6 group-data-panel-open:hidden" />
                  </Button>
                }
              ></Accordion.Trigger>
            </Accordion.Header>
          </div>

          <Accordion.Panel className="mt-3 space-y-1 md:hidden">
            {LINKS.map((link) => (
              <Accordion.Trigger
                key={link.to}
                render={
                  <Link
                    to={link.to}
                    search={link.search}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium"
                    inactiveProps={{
                      className: 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    }}
                    activeProps={{ className: 'bg-primary text-white' }}
                    activeOptions={{
                      includeSearch: false,
                    }}
                  >
                    <link.icon className="size-6" />
                    {link.label}
                  </Link>
                }
              ></Accordion.Trigger>
            ))}
          </Accordion.Panel>
        </Card>
      </Accordion.Item>
    </Accordion.Root>
  );
}
