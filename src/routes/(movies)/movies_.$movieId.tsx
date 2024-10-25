import { Image } from '@/components/image';
import { MovieCard } from '@/components/movie-card';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { tmdbApi } from '@/lib/api';
import { LANGUAGES_MAP, RELEASE_TYPE_MAP } from '@/lib/constants';
import { cn, formatCurrency, formatMinutesToHHMM, getTmdbImage } from '@/lib/utils';
import type { ReleaseType } from '@/types';
import { createFileRoute, Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import {
  ClockIcon,
  CloudIcon,
  Disc3Icon,
  PopcornIcon,
  TicketIcon,
  TvIcon,
  UserRoundIcon,
  type LucideIcon,
} from 'lucide-react';
import React from 'react';

export const Route = createFileRoute('/(movies)/movies_/$movieId')({
  loader: async ({ params }) => {
    return tmdbApi('/movie/:movieId', {
      params,
      query: { append_to_response: ['recommendations', 'similar', 'reviews', 'credits', 'release_dates'] },
    });
  },
  component: Movie,
});

function Movie() {
  const movie = Route.useLoaderData();

  const usReleaseDates = movie.release_dates.results.find((a) => a.iso_3166_1 === 'US')?.release_dates ?? [];

  const RELEASE_TYPE_ICON_MAP = {
    1: PopcornIcon,
    2: TicketIcon,
    3: TicketIcon,
    4: CloudIcon,
    5: Disc3Icon,
    6: TvIcon,
  } satisfies Record<ReleaseType, LucideIcon>;

  const movieDetails = [
    { label: 'Status', value: movie.status },
    {
      label: 'Release Dates',
      value: (
        <div className="grid grid-cols-[auto_1fr] items-center justify-items-end gap-x-2">
          {usReleaseDates.map(({ type, release_date }) => {
            const IconComponent = RELEASE_TYPE_ICON_MAP[type];
            return (
              <React.Fragment key={type}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconComponent className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent side="left">{RELEASE_TYPE_MAP[type]}</TooltipContent>
                </Tooltip>
                {format(release_date, 'MMM d, yyyy')}
              </React.Fragment>
            );
          })}
        </div>
      ),
    },
    { label: 'Revenue', value: formatCurrency(movie.revenue) },
    { label: 'Budget', value: formatCurrency(movie.budget) },
    { label: 'Original Language', value: LANGUAGES_MAP[movie.original_language] },
    { label: 'Production Country', value: movie.production_countries.at(0)?.name },
    { label: 'Studio', value: movie.production_companies.at(0)?.name },
  ];

  return (
    <div className="mx-auto max-w-6xl overflow-hidden p-4">
      {movie.backdrop_path && (
        <div className="absolute top-0 right-0 left-0 -z-10">
          <Image
            className="min-h-[40rem] w-full object-cover opacity-10 blur-xs"
            src={getTmdbImage('backdrop', movie.backdrop_path, 'w1280')}
            alt={`backdrop image for ${movie.title}`}
          />
          <div className="absolute right-0 bottom-0 left-0 h-1/2 bg-gradient-to-t from-gray-1" />
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div className="mt-4 flex flex-col items-center gap-4 md:flex-row md:items-start">
          {movie.poster_path ? (
            <Image
              className="shad h-fit w-48 rounded-xl shadow-lg"
              src={getTmdbImage('poster', movie.poster_path, 'w342')}
              alt={`movie poster for ${movie.title}`}
            />
          ) : (
            <div>no poster</div>
          )}
          <div className="flex flex-col items-center md:items-baseline">
            <h1 className="text-center md:text-left">
              <span className="text-3xl font-bold text-gray-12">{movie.title}</span>
              {movie.release_date && (
                <span className="ml-1 text-base font-medium text-gray-11"> ({movie.release_date.getFullYear()})</span>
              )}
            </h1>
            <div className="mt-1 flex items-center">
              <div className="flex items-center gap-1">
                <ClockIcon className="size-4 text-gray-9" />
                <span className="whitespace-nowrap text-sm font-medium">{formatMinutesToHHMM(movie.runtime)}</span>
              </div>
              <span className="mx-2 text-gray-9">|</span>
              <div className="flex flex-wrap gap-1">
                {movie.genres.map(({ name }) => (
                  <Badge key={name} variant="secondary">
                    {name}
                  </Badge>
                ))}
              </div>
            </div>
            {movie.tagline && (
              <p className="mt-4 text-center italic text-gray-11 md:text-left">&quot;{movie.tagline}&quot;</p>
            )}
            <p className="mt-4 max-w-sm text-center text-gray-11 md:text-left">{movie.overview}</p>
          </div>
        </div>

        <div className="flex min-w-72 flex-col gap-2 md:max-w-80">
          {movie.belongs_to_collection && (
            <div className="glass relative flex items-center justify-between overflow-hidden rounded-xl py-3 px-4">
              {movie.belongs_to_collection.backdrop_path && (
                <Image
                  className="absolute right-0 left-0 -z-10 w-full object-cover opacity-15 blur-xs"
                  src={getTmdbImage(
                    'backdrop',
                    movie.belongs_to_collection.backdrop_path,
                    'w1440_and_h320_multi_faces',
                  )}
                  alt={`backdrop image for ${movie.title}`}
                />
              )}
              <div className="text-pretty font-medium text-gray-12">{movie.belongs_to_collection.name}</div>
              <Link to="/" className={cn('', buttonVariants({ variant: 'outline', size: 'sm' }))}>
                View
              </Link>
            </div>
          )}
          <div className="glass h-fit rounded-xl">
            <dl className="divide-y divide-gray-5 text-sm">
              {movieDetails.map(({ label, value }) => (
                <div key={label} className="flex items-baseline justify-between gap-8 py-3 px-4">
                  <dt className="font-medium text-gray-12">{label}</dt>
                  <dd className="text-end text-gray-11">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-8">
        {movie.credits.cast.length > 0 && (
          <CardCarousel title="Cast">
            {movie.credits.cast.map((person) => (
              <CarouselItem key={`${person.id}-${person.character}`}>
                <PersonCard profilePath={person.profile_path} name={person.name} role={person.character} />
              </CarouselItem>
            ))}
          </CardCarousel>
        )}

        {movie.credits.crew.length > 0 && (
          <CardCarousel title="Crew">
            {movie.credits.crew.map((person) => (
              <CarouselItem key={`${person.id}-${person.job}`}>
                <PersonCard profilePath={person.profile_path} name={person.name} role={person.job} />
              </CarouselItem>
            ))}
          </CardCarousel>
        )}

        {movie.recommendations.results.length > 0 && (
          <CardCarousel title="Recommendations">
            {movie.recommendations.results.map((movie) => (
              <CarouselItem key={movie.id}>
                <MovieCard movie={movie} />
              </CarouselItem>
            ))}
          </CardCarousel>
        )}

        {movie.similar.results.length > 0 && (
          <CardCarousel title="Similar Titles">
            {movie.similar.results.map((movie) => (
              <CarouselItem key={movie.id}>
                <MovieCard movie={movie} />
              </CarouselItem>
            ))}
          </CardCarousel>
        )}
      </div>
    </div>
  );
}

function CardCarousel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Carousel
      opts={{
        align: 'start',
        slidesToScroll: 1,
        breakpoints: {
          '(min-width: 380px)': { slidesToScroll: 2 },
          '(min-width: 560px)': { slidesToScroll: 3 },
          '(min-width: 740px)': { slidesToScroll: 4 },
          '(min-width: 920px)': { slidesToScroll: 5 },
          '(min-width: 1080px)': { slidesToScroll: 6 },
        },
      }}
    >
      <div className="flex items-end justify-between">
        <h2 className="text-2xl font-semibold leading-5">{title}</h2>
        <div className="flex gap-2">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
      <CarouselContent className="mt-3 grid shrink-0 auto-cols-[160px] grid-flow-col gap-4">{children}</CarouselContent>
    </Carousel>
  );
}

function PersonCard({ profilePath, name, role }: { profilePath: string | null; name: string; role: string }) {
  return (
    <Link
      to="/"
      className="flex aspect-2/3 h-full flex-col items-center justify-center rounded-lg border border-gray-4 bg-gradient-to-t from-gray-2 to-gray-3 py-4 px-2"
    >
      {profilePath ? (
        <Image
          className="size-24 rounded-full border border-gray-5 object-cover"
          src={getTmdbImage('profile', profilePath, 'w185')}
          alt={`profile picture of ${name}`}
        />
      ) : (
        <div className="grid size-24 place-items-center rounded-full border border-gray-5 bg-gray-4">
          <UserRoundIcon className="size-8 text-gray-11" />
        </div>
      )}
      <div className="mt-2 text-center font-medium text-gray-12">{name}</div>
      <div className="text-center text-sm text-gray-11">{role}</div>
    </Link>
  );
}
