import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useToggle } from '@uidotdev/usehooks'; // Ensure useToggle is imported
import { format } from 'date-fns';
import {
  ClapperboardIcon,
  ClockIcon,
  CloudIcon,
  Disc3Icon,
  FilmIcon,
  TagIcon,
  TicketIcon,
  TicketSlashIcon,
  TvIcon,
  type LucideIcon,
} from 'lucide-react';
import React from 'react';
import { CardCarousel } from '@/components/card-carousel';
import { ImdbLogo } from '@/components/imdb-logo';
import { MovieCard } from '@/components/movie-card';
import { PaddedLayout } from '@/components/padded-layout';
import { PersonCard } from '@/components/person-card';
import { RottenTomatoesLogo } from '@/components/rotten-tomatoes-logo';
import { ShowMoreButton } from '@/components/show-more-button';
import { TmdbLogo } from '@/components/tmdb-logo';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CarouselItem } from '@/components/ui/carousel';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { omdbApi } from '@/lib/api';
import { LANGUAGES_MAP, MOVIE_RELEASE_TYPE_MAP } from '@/lib/constants';
import { cn, formatCurrency, formatMinutesToHHMM, getTmdbImage } from '@/lib/utils';
import { movieIdQueryOptions } from '@/query-options';
import { Route as CollectionIdRoute } from '@/routes/collections/$collectionId';
import type { MovieReleaseType } from '@/types';

export const Route = createFileRoute('/(movies)/movies_/$movieId')({
  loader: async ({ context, params }) => {
    const movie = await context.queryClient.ensureQueryData(movieIdQueryOptions(params.movieId));
    const omdb = movie.imdb_id ? await omdbApi('/', { query: { i: movie.imdb_id } }) : null;
    return { omdb };
  },
  component: Movie,
});

function Movie() {
  const { movieId } = Route.useParams();
  const { omdb } = Route.useLoaderData();

  const { data: movie } = useSuspenseQuery(movieIdQueryOptions(movieId));

  const usReleaseDates = movie.release_dates.results.find((a) => a.iso_3166_1 === 'US')?.release_dates ?? [];
  const certification = usReleaseDates
    .map(({ certification }) => certification)
    .filter(Boolean)
    .pop();

  const RELEASE_TYPE_ICON_MAP = {
    1: ClapperboardIcon,
    2: TicketSlashIcon,
    3: TicketIcon,
    4: CloudIcon,
    5: Disc3Icon,
    6: TvIcon,
  } satisfies Record<MovieReleaseType, LucideIcon>;

  const [showAllReleaseDates, toggleShowAllReleaseDates] = useToggle(false);

  const movieDetails = [
    { label: 'Status', value: movie.status },
    {
      label: 'Release Dates',
      value: (
        <div className="flex flex-col items-end gap-1">
          <div className="grid grid-cols-[max-content_max-content] items-center justify-items-end gap-x-2">
            {usReleaseDates
              .sort((a, b) => a.release_date.getTime() - b.release_date.getTime())
              .slice(0, showAllReleaseDates ? usReleaseDates.length : 3) // Limit to 5 by default
              .map(({ type, release_date }) => {
                const IconComponent = RELEASE_TYPE_ICON_MAP[type];
                return (
                  <React.Fragment key={type}>
                    <Tooltip>
                      <TooltipTrigger render={<IconComponent className="size-4" />} />

                      <TooltipContent side="left">{MOVIE_RELEASE_TYPE_MAP[type]}</TooltipContent>
                    </Tooltip>
                    {format(release_date, 'MMM d, yyyy')}
                  </React.Fragment>
                );
              })}
          </div>
          {usReleaseDates.length > 3 && (
            <ShowMoreButton onClick={() => toggleShowAllReleaseDates()} showAll={showAllReleaseDates} />
          )}
        </div>
      ),
    },
    { label: 'Revenue', value: formatCurrency(movie.revenue) },
    { label: 'Budget', value: formatCurrency(movie.budget) },
    {
      label: 'Original Language',
      value: (
        <Link
          from={Route.fullPath}
          to="/movies"
          search={{ originalLanguage: movie.original_language }}
          className="-m-1 rounded-md p-1 underline-offset-2 transition-colors hover:text-foreground hover:underline"
        >
          {LANGUAGES_MAP[movie.original_language]}
        </Link>
      ),
    },
    {
      label: 'Production Country',
      value: movie.production_countries.at(0)?.name,
    },
    {
      label: movie.production_companies.length > 1 ? 'Studios' : 'Studio',
      value: (
        <ul>
          {movie.production_companies.map(({ id, name }) => (
            <li key={id}>
              <Link
                from={Route.fullPath}
                to="/movies"
                search={{ studios: [{ value: id.toString(), label: name }] }}
                className="-m-1 rounded-md p-1 underline-offset-2 transition-colors hover:text-foreground hover:underline"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      ),
    },
  ];

  const ratings = [
    {
      score: movie.vote_average,
      logo: TmdbLogo,
      tooltip: 'TMDb User Score',
      logoClass: 'w-7',
    },
    {
      score: omdb?.Ratings.find((r) => r.Source === 'Rotten Tomatoes')?.Value,
      logo: RottenTomatoesLogo,
      tooltip: 'Rotten Tomatoes Tomatometer',
      logoClass: 'w-5',
    },
    {
      score: omdb?.imdbRating !== 'N/A' && omdb?.imdbRating,
      logo: ImdbLogo,
      tooltip: 'IMDb Rating',
      logoClass: 'w-7',
    },
  ].filter((rating) => rating.score);

  const [showAllKeywords, toggleShowAllKeywords] = useToggle(false);

  return (
    <PaddedLayout>
      {movie.backdrop_path && (
        <div className="absolute top-0 right-0 left-0 -z-10">
          <img
            className="h-180 w-full object-cover opacity-15 blur-sm"
            src={getTmdbImage('backdrop', movie.backdrop_path, 'w1280')}
            alt={`backdrop image for ${movie.title}`}
          />
          <div className="absolute right-0 -bottom-4 left-0 h-1/2 bg-linear-to-t from-background" />
        </div>
      )}

      <div className="flex flex-col justify-between gap-16 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
          {movie.poster_path ? (
            <img
              className="w-48 rounded-xl shadow-lg"
              width={192}
              height={288}
              src={getTmdbImage('poster', movie.poster_path, 'w342')}
              alt={`movie poster for ${movie.title}`}
            />
          ) : (
            <div className="grid aspect-2/3 h-auto w-48 place-items-center rounded-xl bg-card shadow-lg">
              <div className="grid size-24 place-items-center rounded-full border bg-muted">
                <FilmIcon className="size-8 text-muted-foreground" />
              </div>
            </div>
          )}
          <div className="flex flex-col items-center md:items-baseline">
            <h1 className="text-center md:text-left">
              <span className="text-3xl font-bold text-foreground">{movie.title}</span>
              {movie.release_date && (
                <span className="ml-1 text-base font-medium text-muted-foreground">
                  {' '}
                  ({movie.release_date.getFullYear()})
                </span>
              )}
            </h1>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-start">
              {certification && (
                <div className="rounded border p-0.5 text-xs leading-none font-medium text-foreground uppercase">
                  {certification}
                </div>
              )}
              <div className="flex items-center gap-1">
                <ClockIcon className="size-4 text-accent" />
                <span className="text-sm font-medium whitespace-nowrap text-foreground">
                  {formatMinutesToHHMM(movie.runtime)}
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {movie.genres.map(({ id, name }) => (
                  <Badge
                    key={id}
                    variant="secondary"
                    render={
                      <Link from={Route.fullPath} to="/movies" search={{ genres: [id] }}>
                        {name}
                      </Link>
                    }
                  />
                ))}
              </div>
            </div>
            {movie.tagline && (
              <p className="mt-4 text-center text-muted-foreground italic md:text-left">&quot;{movie.tagline}&quot;</p>
            )}
            <p className="mt-4 text-balance text-muted-foreground md:text-left">{movie.overview}</p>

            <div>
              <ul className="mt-4 flex flex-wrap gap-1">
                {movie.keywords.keywords
                  .slice(0, showAllKeywords ? movie.keywords.keywords.length : 10)
                  .map(({ id, name }) => (
                    <li key={id}>
                      <Badge
                        variant="secondary"
                        render={
                          <Link
                            from={Route.fullPath}
                            to="/movies"
                            search={{
                              keywords: [{ value: id.toString(), label: name }],
                            }}
                          >
                            <TagIcon className="mr-1 size-3 text-muted-foreground" />
                            {name}
                          </Link>
                        }
                      />
                    </li>
                  ))}
              </ul>
              {movie.keywords.keywords.length > 10 && (
                <ShowMoreButton className="mt-1" onClick={() => toggleShowAllKeywords()} showAll={showAllKeywords} />
              )}
            </div>
          </div>
        </div>

        <div className="flex min-w-72 flex-col gap-2 md:w-80">
          {movie.belongs_to_collection && (
            <Card className="relative flex items-center justify-between overflow-hidden px-4 py-3">
              {movie.belongs_to_collection.backdrop_path && (
                <img
                  className="absolute right-0 left-0 -z-10 w-full object-cover opacity-20"
                  src={getTmdbImage(
                    'backdrop',
                    movie.belongs_to_collection.backdrop_path,
                    'w1440_and_h320_multi_faces',
                  )}
                  alt={`backdrop image for ${movie.title}`}
                />
              )}
              <div className="font-medium text-pretty text-foreground">{movie.belongs_to_collection.name}</div>
              <Link
                to={CollectionIdRoute.fullPath}
                params={{ collectionId: movie.belongs_to_collection.id.toString() }}
                className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}
              >
                View
              </Link>
            </Card>
          )}
          <Card className="h-fit">
            {ratings.length > 0 && (
              <div className="flex justify-center gap-6 border-b py-3">
                {ratings.map((rating, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger className="-m-1 flex items-center gap-1.5 rounded-md p-1">
                      <rating.logo className={rating.logoClass} />
                      <span className="text-sm font-medium text-muted-foreground">{rating.score}</span>
                    </TooltipTrigger>
                    <TooltipContent>{rating.tooltip}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}
            <dl className="divide-y text-sm">
              {movieDetails.map(({ label, value }) => (
                <div key={label} className="flex items-baseline justify-between gap-4 px-4 py-3">
                  <dt className="font-medium whitespace-nowrap text-foreground">{label}</dt>
                  <dd className="text-end text-muted-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-8">
        {movie.credits.cast.length > 0 && (
          <CardCarousel title="Cast" link="cast">
            {movie.credits.cast.map((person) => (
              <CarouselItem key={`${person.id}-${person.character}`}>
                <PersonCard person={person} title={person.character} />
              </CarouselItem>
            ))}
          </CardCarousel>
        )}

        {movie.credits.crew.length > 0 && (
          <CardCarousel title="Crew" link="crew">
            {movie.credits.crew.map((person) => (
              <CarouselItem key={`${person.id}-${person.job}`}>
                <PersonCard person={person} title={person.job} />
              </CarouselItem>
            ))}
          </CardCarousel>
        )}

        {movie.recommendations.results.length > 0 && (
          <CardCarousel title="Recommendations" link="recommendations">
            {movie.recommendations.results.map((movie) => (
              <CarouselItem key={movie.id}>
                <MovieCard movie={movie} />
              </CarouselItem>
            ))}
          </CardCarousel>
        )}

        {movie.similar.results.length > 0 && (
          <CardCarousel title="Similar Titles" link="similar">
            {movie.similar.results.map((movie) => (
              <CarouselItem key={movie.id}>
                <MovieCard movie={movie} />
              </CarouselItem>
            ))}
          </CardCarousel>
        )}
      </div>
    </PaddedLayout>
  );
}
