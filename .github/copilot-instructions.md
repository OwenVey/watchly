# Watchly - AI Agent Guidelines

A React 19 + TypeScript app for exploring movies, TV series, people, and collections with TMDB data plus supplemental OMDb ratings.

## Code Style

- **Formatting**: Use `oxfmt`.
- **Linting**: Use `oxlint`; prefer `bun run lint:fix` when safe.
- **Type Safety**: Keep TypeScript strict and validate external payloads with Valibot.
- **Styling**: Tailwind CSS v4 is the styling system; use `clsx` and `cn()` for conditional classes.
- **Component split**:
  - Reusable primitives belong in `src/components/ui/`.
  - Domain components belong in `src/components/`.
- **Component style**: Destructure props, avoid `React.FC`, and preserve the existing utility-class style.

## Architecture

### Routing

- File-based TanStack React Router with generated `src/routeTree.gen.ts`.
- The root route redirects `/` to `/movies`.
- Route groups are organized under `src/routes/(movies)`, `src/routes/(series)`, `src/routes/(people)`, plus `src/routes/collections` and shared routes like `src/routes/search.tsx`.
- Sidebar-driven discovery routes use layout files such as `_sidebar.tsx`.
- Links generally preload on intent; cards use `preloadDelay={500}`.

### Data Fetching

- `src/lib/api.ts` defines both `tmdbApi` and `omdbApi` with `@better-fetch/fetch` schemas.
- `src/query-options.ts` centralizes TanStack React Query definitions.
- Use `infiniteQueryOptions()` for discovery, people lists, and search.
- Use `queryOptions()` for detail pages.
- Existing discovery queries often fetch three pages at a time and deduplicate by item ID before rendering.
- Default caching treats data as always fresh with `staleTime: Number.POSITIVE_INFINITY`.

### App Shell and Theme

- `src/main.tsx` wires the router, query client, SSR query integration, tooltip provider, and theme provider.
- Theme state lives in `src/components/theme-provider.tsx`.
- Persisted theme storage key is `watchly-ui-theme`.
- The navbar owns primary navigation, global search, and the theme toggle.
- The root route mounts TanStack Query and Router devtools panels.

## Build and Tooling

```bash
bun install
bun run dev
bun run build
bun run build:analyze
bun run lint
bun run lint:fix
bun run format
bun run knip
bun run preview
```

- `bun run build` runs `tsgo --build` before `vite build`.
- The project expects Bun `1.3.12` and Node `>=24`.
- Vite uses the TanStack Router plugin, TanStack Devtools plugin, Tailwind plugin, and Babel with the React Compiler preset.
- Bundle analysis is enabled with `ANALYZE=true` outside Vercel.

## Repo Conventions

### API Integration

- TMDB is the primary source for discovery, details, providers, people, and collections.
- OMDb is used to enrich detail pages with IMDb and Rotten Tomatoes ratings when an IMDb ID exists.
- Keep API schemas in `src/schemas.ts` aligned with real responses.
- Preserve the existing conditional query spreading pattern to avoid sending default filters.

### Query Keys

- Follow the existing key shape: `['resource', params]` for collection-like data and `['resource', id]` for detail queries.
- Keep related fetch logic in `src/query-options.ts` instead of scattering raw fetches through components.

### Components

- Use `getTmdbImage()` from `src/lib/utils.ts` for TMDB image URLs.
- Preserve the current card and link behavior, including route preloading.
- Prefer existing UI primitives over ad hoc controls when equivalent components already exist.

### Types and Validation

- Shared types live in `src/types.ts`.
- Schemas in `src/schemas.ts` are the source of truth for external API payloads.
- When OMDb can return an error payload, handle that explicitly instead of assuming ratings exist.

## Integration Points

- **TMDB API**: `https://api.themoviedb.org/3`
- **OMDb API**: `https://www.omdbapi.com`
- **Core libraries**:
  - `@tanstack/react-router`
  - `@tanstack/react-query`
  - `@better-fetch/fetch`
  - `valibot`
  - `lucide-react`
  - `@base-ui/react`
  - `embla-carousel-react`

## Security

- TMDB and OMDb credentials are embedded in `src/lib/api.ts` for this client-only app.
- Data is read-only public media metadata.
- There is no authentication, authorization, or user-generated content flow.
- Continue validating external responses with Valibot before relying on fields in UI code.
