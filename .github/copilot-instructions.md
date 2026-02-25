# Watchly - AI Agent Guidelines

A React 19 + TypeScript application for discovering movies and TV series using the TMDB API.

## Code Style

- **Formatting**: Use `oxfmt` for formatting, `oxlint` for linting—run `bun run lint:fix` before committing
- **Styling**: Tailwind CSS v4 with utility classes; use `clsx`/`cn()` for conditional styling
- **Type Safety**: Strict TypeScript with Valibot schema validation for all API responses
- **Component Patterns**:
  - UI components in `src/components/ui/` (reusable, presentational)
  - Feature components in `src/components/` (domain-specific, movie-card.tsx example)
  - Example: [movie-card.tsx](src/components/movie-card.tsx) uses Link with preloadDelay, styled with TailwindCSS and cn() utility

## Architecture

### Routing

- File-based routing via TanStack React Router with autorgenerated routeTree.gen.ts
- Routes in `src/routes/` organized by feature: `(movies)/`, `(series)/`, `(people)/`
- Route params passed through TanStack Router Link component (e.g., `movieId` in URL)
- Example: [routes structure](src/routes/) shows layout routes with \_sidebar.tsx, data routes with $movieId.tsx pattern

### Data Fetching

- **API Client**: [lib/api.ts](src/lib/api.ts) uses `@better-fetch/fetch` with Valibot schema validation
- **Query Management**: [query-options.ts](src/query-options.ts) centralizes all TanStack React Query configurations
- **Pattern**: Use `infiniteQueryOptions()` for pagination, `queryOptions()` for single fetches
- **Caching**: Default `staleTime: Infinity` (treat data as always fresh unless explicitly invalidated)
- **Prefetching**: Links use `preloadDelay={500}` to load data on intent

### Styling & Theme

- Tailwind CSS v4 with @tailwindcss/vite plugin (no PostCSS needed)
- Theme provider ([theme-provider.tsx](src/components/theme-provider.tsx)) manages system/light/dark modes
- Shadcn/Base UI components in `src/components/ui/`

## Build and Test

```bash
bun install           # Install dependencies
bun run dev          # Start Vite dev server (http://localhost:5173)
bun run build        # TypeScript + Vite build
bun run lint         # Run oxlint
bun run lint:fix     # Fix linting issues
bun run format       # Format with oxfmt
bun run preview      # Preview production build locally
```

- **Hot Module Replacement**: Vite + React Router enabled by default
- **Devtools**: React Query and Router devtools included in development

## Project Conventions

### API Integration

- TMDB API token in [lib/api.ts](src/lib/api.ts) (Bearer auth)
- All endpoints use Valibot schemas: see [schemas.ts](src/schemas.ts)
- Query parameters conditionally spread to avoid sending defaults
- Fetch patterns: single calls, paginated infinite queries, and batch fetches (e.g., 3 pages ahead)

### Component Structure

- Destructure props with type, avoid `React.FC`
- Use `getTmdbImage()` utility for poster/backdrop images
- Link components include `preloadDelay={500}` for route preloading
- Conditional rendering with `cn()` utility for className merging

### Data Types

- Defined in [src/types.ts](src/types.ts)
- Movie/Series have consistent structure (id, title, poster_path, etc.)
- Schemas validate and transform API responses (see `DiscoverMoviesOutputSchema`)

### Query Keys

- Pattern: `['resource-type', params]` for keying (e.g., `['movies', params]`)
- Used by React Query for caching and invalidation

## Integration Points

- **TMDB API**: `https://api.themoviedb.org/3` with read-only endpoints
- **External Libraries**:
  - `@tanstack/react-router` for routing and data fetching
  - `@tanstack/react-query` for client-side caching
  - `lucide-react` for icons
  - `embla-carousel-react` for carousels
  - `cmdk` for command/search UI
- **React Compiler**: Enabled in Vite config for automatic memoization

## Security

- TMDB API token embedded in [lib/api.ts](src/lib/api.ts)—read-only access, safe for client
- No user auth system currently; data is public TMDB information
- Input validation via Valibot schemas on API responses
- Links use TanStack Router for client-side navigation (no external navigation risks)
