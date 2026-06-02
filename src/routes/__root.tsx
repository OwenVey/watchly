import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { HeadContent, Link, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { Navbar } from '@/components/navbar';
import { ThemeProvider } from '@/components/theme-provider';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import appCss from '../styles.css?url';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    links: [
      {
        href: appCss,
        rel: 'stylesheet',
      },
    ],
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        content: 'width=device-width, initial-scale=1',
        name: 'viewport',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
  }),
  notFoundComponent: () => (
    <main className="grid min-h-full w-full place-items-center px-6 py-24 text-center sm:py-32 lg:px-8">
      <p className="text-base font-semibold text-primary">404</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-primary-foreground sm:text-7xl">
        Page not found
      </h1>
      <p className="mt-6 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">
        Sorry, we couldn't find the page you're looking for.
      </p>

      <Link to="/" className={cn(buttonVariants({ variant: 'default' }), 'mt-10')}>
        Go back home
      </Link>
    </main>
  ),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <Navbar />
          <div className="flex">{children}</div>
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              {
                name: 'Tanstack Query',
                render: <ReactQueryDevtoolsPanel />,
              },
            ]}
          />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
