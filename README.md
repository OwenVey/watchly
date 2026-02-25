# Watchly

Watchly is a React 19 + TypeScript web app for discovering movies, TV series, and people using TMDB data, with extra ratings from OMDb.

It includes advanced filter-based discovery, unified search across media types, detailed content pages, and infinite scrolling lists.

## Features

- **Movie discovery** with filter sidebar:
  - release date range
  - rating range
  - vote count range
  - runtime range
  - sort field + direction
  - genres, release types, keywords, studios
  - original language, watch providers, adult toggle
- **Series discovery** with filter sidebar:
  - first air date range
  - rating and vote count ranges
  - sort field + direction
  - genres, status, TV show types, keywords, studios, networks
  - original language, watch providers, adult toggle
- **Global search** across movies, TV shows, and people with merged, popularity-sorted results
- **People browser** with infinite scrolling popular people list
- **Movie details** with:
  - cast/crew tabs
  - recommendations/similar tabs
  - release dates, runtime, genres, keywords, studios
  - ratings from TMDB + IMDb + Rotten Tomatoes (via OMDb)
  - collection linking when available
- **Series details** with:
  - cast/crew tabs
  - recommendations/similar tabs
  - seasons accordion with lazy-loaded episode details
  - ratings from TMDB + IMDb + Rotten Tomatoes (via OMDb)
- **Person details** including biography, appearances, and crew credits
- **Collection pages** showing collection metadata and sorted movie parts
- **Theming**: light/dark/system mode via persisted theme preference
- **Responsive UI** with desktop sidebars and mobile filter sheets/navigation

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript (strict)
- **Build tool**: Vite 7
- **Routing**: TanStack React Router (file-based)
- **Data fetching/caching**: TanStack React Query
- **API client + validation**: `@better-fetch/fetch` + Zod schemas
- **Styling**: Tailwind CSS v4 + utility components in `src/components/ui`
- **Icons**: `lucide-react`

## Project Architecture

- **Routes** are defined under `src/routes` and generated into `src/routeTree.gen.ts`.
- **Query options** are centralized in `src/query-options.ts`.
- **API clients** live in `src/lib/api.ts`:
  - `tmdbApi` for TMDB endpoints
  - `omdbApi` for supplemental ratings
- **Schemas** for response validation are in `src/schemas.ts`.
- **Default search/filter state** is in `src/lib/constants.ts`.
- **Reusable UI primitives** are in `src/components/ui`.

## Getting Started

### Prerequisites

- Bun (latest stable)

### Install

```bash
bun install
```

### Run development server

```bash
bun run dev
```

App runs at `http://localhost:5173` by default.

## Available Scripts

- `bun run dev` — start Vite dev server
- `bun run build` — type-check build + production bundle
- `bun run preview` — preview production build locally
- `bun run typecheck` — run TypeScript checks only
- `bun run lint` — run oxlint
- `bun run lint:fix` — auto-fix lint issues
- `bun run format` — format code with oxfmt

## Development Notes

- Keep route files in `src/routes` and let TanStack Router regenerate `routeTree.gen.ts`.
- Add or update query definitions in `src/query-options.ts` for consistency.
- Validate new/changed API responses with Zod schemas in `src/schemas.ts`.
- Use shared helpers from `src/lib/utils.ts` and constants from `src/lib/constants.ts`.

## API & Security Notes

- This app uses **read-only public movie/TV/person data** from TMDB.
- TMDB Bearer token and OMDb API key are currently configured in `src/lib/api.ts`.
- No user authentication or user-generated content is implemented.

## License

No license file is currently defined in this repository.
