import { Navbar } from '@/components/navbar';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, ScrollRestoration, createRootRouteWithContext } from '@tanstack/react-router';
import React, { Suspense } from 'react';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : React.lazy(() =>
      import('@tanstack/router-devtools').then((res) => ({
        default: res.TanStackRouterDevtools,
      })),
    );

function RootComponent() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <Navbar />
      <ScrollRestoration />
      <div className="flex flex-1 overflow-auto">
        <Outlet />
      </div>
      <ReactQueryDevtools buttonPosition="bottom-left" />
      <Suspense>
        <TanStackRouterDevtools position="bottom-right" />
      </Suspense>
    </div>
  );
}
