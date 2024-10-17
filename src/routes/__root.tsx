import { ModeToggle } from '@/components/mode-toggle';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Link, Outlet, ScrollRestoration, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <nav className="flex items-center justify-between border-gray-6 border-b bg-background px-6 py-4">
        <Link to="/" className="font-bold text-2xl">
          Watchly
        </Link>
        <div className="space-x-4">
          <Link
            to="/movies"
            activeProps={{
              className: 'font-bold',
            }}
          >
            Movies
          </Link>
          <Link
            to="/tv"
            activeProps={{
              className: 'font-bold',
            }}
          >
            TV Shows
          </Link>
        </div>
        <div>
          <ModeToggle />
        </div>
      </nav>
      <ScrollRestoration />
      <Outlet />
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
