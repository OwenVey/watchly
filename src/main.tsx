import './index.css';
import { QueryClient } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { routeTree } from './routeTree.gen';

function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: Number.POSITIVE_INFINITY,
      },
    },
  });

  // Set up a Router instance
  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
    defaultStaleTime: Number.POSITIVE_INFINITY,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

const router = getRouter();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById('app')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="watchly-ui-theme">
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </ThemeProvider>
    </StrictMode>,
  );
}
