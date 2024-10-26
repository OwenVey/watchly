import { ImdbLogo } from '@/components/imdb-logo';
import { MovieCard } from '@/components/movie-card';
import { RottenTomatoesLogo } from '@/components/rotten-tomatoes-logo';
import { TmdbLogo } from '@/components/tmdb-logo';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { omdbApi, tmdbApi } from '@/lib/api';
import { LANGUAGES_MAP, RELEASE_TYPE_MAP } from '@/lib/constants';
import { cn, formatCurrency, formatMinutesToHHMM, getTmdbImage } from '@/lib/utils';
import type { ReleaseType } from '@/types';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useToggle } from '@uidotdev/usehooks'; // Ensure useToggle is imported
import { format } from 'date-fns';
import {
  CircleArrowRightIcon,
  ClockIcon,
  CloudIcon,
  Disc3Icon,
  PopcornIcon,
  TagIcon,
  TicketIcon,
  TvIcon,
  UserRoundIcon,
  type LucideIcon,
} from 'lucide-react';
import React from 'react';

export const Route = createFileRoute('/(movies)/movies_/$movieId')({
  loader: async ({ params }) => {
    const movie = await tmdbApi('/movie/:movieId', {
      params,
      query: { append_to_response: ['recommendations', 'similar', 'reviews', 'credits', 'release_dates', 'keywords'] },
    });

    const omdb = movie.imdb_id ? await omdbApi('/', { query: { i: movie.imdb_id } }) : null;

    return { movie, omdb };
  },
  component: Movie,
});

function Movie() {
  const { movie, omdb } = Route.useLoaderData();

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
    {
      label: movie.production_companies.length > 1 ? 'Studios' : 'Studio',
      value: (
        <ul>
          {movie.production_companies.map((studio) => (
            <li key={studio.id}>{studio.name}</li>
          ))}
        </ul>
      ),
    },
  ];

  const ratings = [
    { score: movie.vote_average, logo: TmdbLogo, tooltip: 'TMDb User Score', logoClass: 'w-7' },
    {
      score: omdb?.Ratings.find((r) => r.Source === 'Rotten Tomatoes')?.Value,
      logo: RottenTomatoesLogo,
      tooltip: 'Rotten Tomatoes Tomatometer',
      logoClass: 'w-5',
    },
    { score: omdb?.imdbRating, logo: ImdbLogo, tooltip: 'IMDb Rating', logoClass: 'w-7' },
  ].filter((rating) => rating.score);

  const [showAllKeywords, toggleShowAllKeywords] = useToggle(false);

  return (
    <div className="mx-auto max-w-6xl overflow-hidden p-4">
      {movie.backdrop_path && (
        <div className="absolute top-0 right-0 left-0 -z-10">
          <img
            className="h-[45rem] w-full object-cover opacity-10 blur-sm"
            src={getTmdbImage('backdrop', movie.backdrop_path, 'w300')}
            alt={`backdrop image for ${movie.title}`}
          />
          <div className="absolute right-0 -bottom-4 left-0 h-1/2 bg-gradient-to-t from-gray-1" />
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 md:flex-row">
        <div className="mt-4 flex flex-col items-center gap-4 md:flex-row md:items-start">
          {movie.poster_path ? (
            <img
              className="h-fit w-48 rounded-xl shadow-lg"
              src={getTmdbImage('poster', movie.poster_path, 'w342')}
              alt={`movie poster for ${movie.title}`}
            />
          ) : (
            <div>no poster</div>
          )}
          <div className="flex max-w-md flex-col items-center md:items-baseline">
            <h1 className="text-center md:text-left">
              <span className="text-3xl font-bold text-gray-12">{movie.title}</span>
              {movie.release_date && (
                <span className="ml-1 text-base font-medium text-gray-11"> ({movie.release_date.getFullYear()})</span>
              )}
            </h1>
            <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-start">
              <div className="flex items-center gap-1">
                <ClockIcon className="size-4 text-gray-9" />
                <span className="whitespace-nowrap text-sm font-medium">{formatMinutesToHHMM(movie.runtime)}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {movie.genres.map(({ id, name }) => (
                  <Badge key={id} asChild variant="secondary" className="hover:border-gray-8 hover:bg-gray-7">
                    <Link from={Route.fullPath} to="/movies" search={{ genres: [id] }}>
                      {name}
                    </Link>
                  </Badge>
                ))}
              </div>
            </div>
            {movie.tagline && (
              <p className="mt-4 text-center italic text-gray-11 md:text-left">&quot;{movie.tagline}&quot;</p>
            )}
            <p className="mt-4 text-balance text-gray-11 md:text-left">{movie.overview}</p>

            <div>
              <ul className="mt-4 flex flex-wrap gap-1">
                {movie.keywords.keywords
                  .slice(0, showAllKeywords ? movie.keywords.keywords.length : 10)
                  .map(({ id, name }) => (
                    <li key={id}>
                      <Badge asChild variant="secondary" className="hover:border-gray-8 hover:bg-gray-7">
                        <Link
                          from={Route.fullPath}
                          to="/movies"
                          search={{ keywords: [{ value: id.toString(), label: name }] }}
                        >
                          <TagIcon className="mr-1 size-3 text-gray-11" />
                          {name}
                        </Link>
                      </Badge>
                    </li>
                  ))}
              </ul>
              {movie.keywords.keywords.length > 10 && (
                <button
                  onClick={() => toggleShowAllKeywords()}
                  className="mt-1 text-sm text-gray-11 hover:text-gray-12"
                >
                  {showAllKeywords ? 'Show Less' : 'Show More'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex min-w-72 flex-col gap-2 md:max-w-80">
          {movie.belongs_to_collection && (
            <Card className="relative flex items-center justify-between overflow-hidden py-3 px-4">
              {movie.belongs_to_collection.backdrop_path && (
                <img
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
            </Card>
          )}
          <Card className="h-fit">
            <div className="flex justify-center gap-6 border-b border-gray-5 py-3">
              {ratings.map((rating, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger className="flex items-center gap-1.5">
                    <rating.logo className={rating.logoClass} />
                    <span className="text-sm font-medium text-gray-11">{rating.score}</span>
                  </TooltipTrigger>
                  <TooltipContent>{rating.tooltip}</TooltipContent>
                </Tooltip>
              ))}
            </div>
            <dl className="divide-y divide-gray-5 text-sm">
              {movieDetails.map(({ label, value }) => (
                <div key={label} className="flex items-baseline justify-between gap-8 py-3 px-4">
                  <dt className="font-medium text-gray-12">{label}</dt>
                  <dd className="text-end text-gray-11">{value}</dd>
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
                <PersonCard profilePath={person.profile_path} name={person.name} role={person.character} />
              </CarouselItem>
            ))}
          </CardCarousel>
        )}

        {movie.credits.crew.length > 0 && (
          <CardCarousel title="Crew" link="crew">
            {movie.credits.crew.map((person) => (
              <CarouselItem key={`${person.id}-${person.job}`}>
                <PersonCard profilePath={person.profile_path} name={person.name} role={person.job} />
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
    </div>
  );
}

function CardCarousel({ title, children, link }: { title: string; children: React.ReactNode; link: string }) {
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
        <Link className="group flex items-center gap-1.5" from={Route.fullPath} to={link}>
          <h2 className="text-2xl font-semibold leading-5 text-gray-12">{title}</h2>
          <CircleArrowRightIcon className="size-6 text-gray-9 transition-colors group-hover:text-gray-12" />
        </Link>
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
    <Card asChild hover>
      <Link
        to="/"
        className="flex aspect-2/3 flex-col items-center justify-center py-4 px-2 transition-all hover:scale-105"
      >
        {profilePath ? (
          <img
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
    </Card>
  );
}
