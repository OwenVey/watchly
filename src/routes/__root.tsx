import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import * as React from 'react';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <nav className="flex items-center justify-between px-6 py-4 bg-background border-b">
        <Link to="/" className="text-2xl font-bold">
          MovieFinder
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
          {/* Placeholder for user menu or additional navigation items */}
        </div>
      </nav>
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
