# Watchly

Watchly is a React 19 + TypeScript app for exploring movies, TV series, people, and collections using TMDB data, with supplemental ratings pulled from OMDb.

The app centers on filter-heavy discovery flows, infinite lists, detailed title and person pages, and fast client-side navigation powered by TanStack Router and React Query.

## Features

- Movie discovery with a dedicated sidebar for release date, rating, vote count, runtime, sort order, genres, release types, keywords, studios, original language, watch providers, and adult-content filtering.
- Series discovery with a dedicated sidebar for first air date, rating, vote count, sort order, genres, status, TV show types, keywords, studios, networks, original language, watch providers, and adult-content filtering.
- Global search across movies, TV series, and people, with merged results sorted by popularity.
- Popular people browser with infinite scrolling.
- Movie detail pages with cast, crew, recommendations, similar titles, release dates, keywords, studios, runtime, and collection links when present.
- Series detail pages with cast, crew, recommendations, similar titles, content ratings, external IDs, and season/episode exploration.
- Person pages with biography, deduplicated cast appearances, and crew credits.
- Collection pages with collection metadata and sorted movie entries.
- Light, dark, and system theme support persisted in local storage.
- Responsive navigation with desktop tabs and a mobile accordion menu.

## Tech Stack

- React 19
- TypeScript in strict mode
- Vite 8 for dev and bundling
- `tsgo` for type-checking during builds
- TanStack React Router with generated route tree
- TanStack React Query for data loading and caching
- `@better-fetch/fetch` with Valibot schemas for API validation
- Tailwind CSS v4 with Base UI-based primitives in `src/components/ui`
- `lucide-react` icons

## Architecture

- Routes live in `src/routes` and generate `src/routeTree.gen.ts`.
- The root route redirects `/` to `/movies`.
- Search and discovery data access is centralized in `src/query-options.ts`.
- TMDB and OMDb clients live in `src/lib/api.ts`.
- API response validation lives in `src/schemas.ts`.
- Default discovery state and lookup maps live in `src/lib/constants.ts`.
- Shared presentational primitives live in `src/components/ui`.

## Data Fetching

- Discovery and people pages use `infiniteQueryOptions()`.
- Detail pages use `queryOptions()`.
- Several infinite queries fetch three pages at a time and deduplicate results by ID before rendering.
- Router and query defaults treat fetched data as fresh with `staleTime: Number.POSITIVE_INFINITY`.
- Card links use intent-based preloading with `preloadDelay={500}`.

## Getting Started

### Prerequisites

- Node.js `24` or newer

### Install

```bash
nub install
```

### Start the development server

```bash
nub run dev
```

The app runs at `http://localhost:5173` by default.

## Scripts

- `nub run dev` starts the Vite development server.
- `nub run build` runs `tsc --build` and then creates the production Vite bundle.
- `nub run build:analyze` builds with bundle analysis enabled outside Vercel.
- `nub run preview` serves the production build locally.
- `nub run lint` runs `oxlint`.
- `nub run lint:fix` runs `oxlint --fix`.
- `nub run format` runs `oxfmt`.
- `nub run knip` checks for unused files and exports.

## Development Notes

- Keep route files under `src/routes`; the TanStack router plugin regenerates the route tree.
- Update `src/query-options.ts` when adding new fetching flows.
- Validate any new or changed external API payloads in `src/schemas.ts`.
- Use helpers from `src/lib/utils.ts` and shared constants from `src/lib/constants.ts`.
- Theme preference is stored under the `watchly-ui-theme` local storage key.
- The root layout mounts TanStack Query and Router devtools panels.

## API and Security Notes

- TMDB is the primary data source for movies, TV, people, providers, and collections.
- OMDb is used for supplemental IMDb and Rotten Tomatoes ratings when an IMDb ID is available.
- Both API credentials are currently embedded in `src/lib/api.ts` for this client-only app.
- The app has no authentication, no user accounts, and no user-generated content.

## License

No license file is currently defined in this repository.
