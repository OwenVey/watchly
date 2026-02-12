import * as Accordion from '@radix-ui/react-accordion';
import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useDebounce } from '@uidotdev/usehooks';
import { FilmIcon, MenuIcon, SearchIcon, TvIcon, UsersIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/logo';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const LINKS = [
  {
    to: '/movies',
    label: 'Movies',
    icon: FilmIcon,
  },
  {
    to: '/series',
    label: 'Series',
    icon: TvIcon,
  },
  {
    to: '/people',
    label: 'People',
    icon: UsersIcon,
  },
];

export function Navbar() {
  const navigate = useNavigate();
  const { query } = useSearch({ strict: false });

  const [search, setSearch] = useState(query ?? '');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch) {
      void navigate({ to: '/search', search: { query: debouncedSearch } });
    } else {
      void navigate({ to: '.' });
    }
  }, [debouncedSearch, navigate]);

  return (
    <Accordion.Root type="single" collapsible asChild>
      <Accordion.Item value="nav" asChild>
        <nav className="group sticky top-0 z-10 p-4 pb-0">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-1 from-[1rem]" />
          <Card className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link to="/" className="-m-1 flex items-center gap-2 rounded-lg p-1 text-lg font-semibold text-gray-12">
                  <Logo className="size-8 text-primary-9" />
                  Watchly
                </Link>

                <div className="ml-8 hidden items-center gap-2 text-sm md:flex">
                  {LINKS.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      search={undefined}
                      className="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-gray-11 transition-all hover:bg-gray-4 hover:text-gray-12"
                      activeOptions={{
                        includeSearch: false,
                      }}
                      activeProps={{ className: 'bg-primary-9 text-white hover:bg-primary-9' }}
                    >
                      <link.icon className="size-5" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-1 justify-center gap-4 md:justify-end">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mr-6 ml-8 max-w-96 md:mr-0 md:ml-2 md:max-w-52"
                  icon={SearchIcon}
                  placeholder="Search"
                />
                <div className="hidden md:block">
                  <ModeToggle />
                </div>
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
                    search={undefined}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-gray-11 hover:bg-gray-10/20 hover:text-gray-12"
                    activeOptions={{
                      includeSearch: false,
                    }}
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
