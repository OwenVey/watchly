import { CardCarousel } from '@/components/card-carousel';
import { ImdbLogo } from '@/components/imdb-logo';
import { PaddedLayout } from '@/components/padded-layout';
import { PersonCard } from '@/components/person-card';
import { RottenTomatoesLogo } from '@/components/rotten-tomatoes-logo';
import { SeriesCard } from '@/components/series-card';
import { ShowMoreButton } from '@/components/show-more-button';
import { TmdbLogo } from '@/components/tmdb-logo';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CarouselItem } from '@/components/ui/carousel';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { omdbApi, tmdbApi } from '@/lib/api';
import { LANGUAGES_MAP } from '@/lib/constants';
import { formatMinutesToHHMM, getTmdbImage } from '@/lib/utils';
import { seriesIdQueryOptions } from '@/query-options';
import type { Season } from '@/types';
import * as Accordion from '@radix-ui/react-accordion';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useToggle } from '@uidotdev/usehooks';
import { format } from 'date-fns';
import { ChevronDownIcon, ImageIcon, StarIcon, TagIcon, TvIcon } from 'lucide-react';
import { useState } from 'react';

export const Route = createFileRoute('/(series)/series_/$seriesId')({
  loader: async ({ context, params }) => {
    const series = await context.queryClient.ensureQueryData(seriesIdQueryOptions(params.seriesId));
    const imdbId = series.external_ids.imdb_id;
    const omdb = imdbId ? await omdbApi('/', { query: { i: imdbId } }) : null;
    return { omdb };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { seriesId } = Route.useParams();
  const { omdb } = Route.useLoaderData();

  const [seasonDetails, setSeasonDetails] = useState<Map<string, Season>>(new Map());

  const { data: series } = useSuspenseQuery(seriesIdQueryOptions(seriesId));

  const contentRating = series.content_ratings.results.find((a) => a.iso_3166_1 === 'US')?.rating;

  const seriesDetails = [
    { label: 'Status', value: series.status },
    {
      label: 'First Air Date',
      value: series.first_air_date && format(series.first_air_date, 'MMM d, yyyy'),
    },
    {
      label: 'Next Air Date',
      value: series.next_episode_to_air?.air_date && format(series.next_episode_to_air.air_date, 'MMM d, yyyy'),
    },
    {
      label: 'Episode Runtime',
      value: series.episode_run_time[0] && `${series.episode_run_time[0]} Minutes`,
    },
    {
      label: 'Original Language',
      value: (
        <Link
          from={Route.fullPath}
          to="/movies"
          search={{ originalLanguage: series.original_language }}
          className="-m-1 rounded-md p-1 underline-offset-2 transition-colors hover:text-gray-12 hover:underline"
        >
          {LANGUAGES_MAP[series.original_language]}
        </Link>
      ),
    },
    {
      label: 'Production Country',
      value: series.production_countries.at(0)?.name,
    },
    {
      label: series.production_companies.length > 1 ? 'Studios' : 'Studio',
      value:
        series.production_companies.length > 0 ? (
          <ul>
            {series.production_companies.map(({ id, name }) => (
              <li key={id}>
                <Link
                  from={Route.fullPath}
                  to="/series"
                  search={{ studios: [{ value: id.toString(), label: name }] }}
                  className="-m-1 rounded-md p-1 underline-offset-2 transition-colors hover:text-gray-12 hover:underline"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        ) : null,
    },
    {
      label: series.networks.length > 1 ? 'Networks' : 'Network',
      value:
        series.networks.length > 0 ? (
          <ul>
            {series.networks.map(({ id, name }) => (
              <li key={id}>
                <Link
                  from={Route.fullPath}
                  to="/series"
                  search={{ networks: [{ value: id.toString(), label: name }] }}
                  className="-m-1 rounded-md p-1 underline-offset-2 transition-colors hover:text-gray-12 hover:underline"
                >
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        ) : null,
    },
  ].filter(({ value }) => value);

  const ratings = [
    {
      score: series.vote_average,
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
      {series.backdrop_path && (
        <div className="absolute top-0 right-0 left-0 -z-10">
          <img
            className="h-[45rem] w-full object-cover opacity-15 blur-sm"
            src={getTmdbImage('backdrop', series.backdrop_path, 'w1280')}
            alt={`backdrop image for ${series.name}`}
          />
          <div className="absolute right-0 -bottom-4 left-0 h-1/2 bg-gradient-to-t from-gray-1" />
        </div>
      )}

      <div className="flex flex-col justify-between gap-16 md:flex-row">
        <div className="flex w-full flex-col gap-8">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
            {series.poster_path ? (
              <img
                className="w-48 rounded-xl shadow-lg"
                width={192}
                height={288}
                src={getTmdbImage('poster', series.poster_path, 'w342')}
                alt={`movie poster for ${series.name}`}
              />
            ) : (
              <div className="grid aspect-2/3 h-auto w-48 place-items-center rounded-xl bg-gray-3 shadow-lg">
                <div className="grid size-24 place-items-center rounded-full border border-gray-6 bg-gray-5">
                  <TvIcon className="size-8 text-gray-11" />
                </div>
              </div>
            )}
            <div className="flex flex-col items-center md:items-baseline">
              <h1 className="text-center md:text-left">
                <span className="text-3xl font-bold text-gray-12">{series.name}</span>
                {series.first_air_date && (
                  <span className="ml-1 text-base font-medium text-gray-11">
                    {' '}
                    ({series.first_air_date.getFullYear()})
                  </span>
                )}
              </h1>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-start">
                {contentRating && (
                  <div className="rounded border p-0.5 text-xs leading-none font-medium text-gray-12 uppercase">
                    {contentRating}
                  </div>
                )}

                <div className="text-sm font-medium whitespace-nowrap text-gray-12">
                  {series.seasons.length} Seasons
                </div>

                <div className="flex flex-wrap gap-1">
                  {series.genres.map(({ id, name }) => (
                    <Badge key={id} asChild variant="secondary" hover>
                      <Link from={Route.fullPath} to="/series" search={{ genres: [id] }}>
                        {name}
                      </Link>
                    </Badge>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-balance text-gray-11 md:text-left">{series.overview}</p>

              <div>
                <ul className="mt-4 flex flex-wrap gap-1">
                  {series.keywords.results
                    .slice(0, showAllKeywords ? series.keywords.results.length : 10)
                    .map(({ id, name }) => (
                      <li key={id}>
                        <Badge asChild variant="secondary" hover>
                          <Link
                            from={Route.fullPath}
                            to="/movies"
                            search={{
                              keywords: [{ value: id.toString(), label: name }],
                            }}
                          >
                            <TagIcon className="mr-1 size-3 text-gray-11" />
                            {name}
                          </Link>
                        </Badge>
                      </li>
                    ))}
                </ul>
                {series.keywords.results.length > 10 && (
                  <ShowMoreButton className="mt-1" onClick={() => toggleShowAllKeywords()} showAll={showAllKeywords} />
                )}
              </div>
            </div>
          </div>
          {series.seasons.length > 0 && (
            <div>
              <h2 className="text-2xl leading-5 font-semibold text-gray-12">Seasons</h2>
              <Accordion.Root
                type="multiple"
                className="mt-3 flex flex-col gap-2"
                onValueChange={async (seasonNumbers) => {
                  for (const seasonNumber of seasonNumbers) {
                    if (!seasonDetails.has(seasonNumber)) {
                      const details = await tmdbApi('/tv/:seriesId/season/:seasonNumber', {
                        params: { seriesId: series.id.toString(), seasonNumber },
                      });
                      setSeasonDetails((prev) => new Map(prev).set(seasonNumber, details));
                    }
                  }
                }}
              >
                {series.seasons.map((season) => (
                  <Accordion.Item
                    key={season.id}
                    value={season.season_number.toString()}
                    disabled={season.episode_count === 0}
                  >
                    <Accordion.Header>
                      <Accordion.Trigger className="group relative flex w-full items-center justify-between border border-gray-11/15 bg-gray-3/60 p-2 backdrop-blur-xl transition-all hover:border-gray-11/35 hover:bg-gray-3/90 data-disabled:pointer-events-none data-[state=closed]:rounded-lg data-[state=open]:rounded-t-lg [&[data-state=open]>svg]:rotate-180">
                        {season.vote_average && (
                          <Badge variant="secondary" className="absolute top-2 right-2">
                            <StarIcon className="mr-1 size-3 text-gray-10" fill="currentColor" />
                            {season.vote_average}
                          </Badge>
                        )}
                        <div className="flex gap-4">
                          {season.poster_path ? (
                            <img
                              className="w-12 rounded-md shadow-lg"
                              width={76}
                              height={48}
                              src={getTmdbImage('poster', season.poster_path, 'w92')}
                              alt={`season poster of ${season.name}`}
                            />
                          ) : (
                            <div className="grid aspect-2/3 h-auto w-12 place-items-center rounded-md bg-gray-4 shadow-lg">
                              <ImageIcon className="size-6 text-gray-10" />
                            </div>
                          )}
                          <div className="text-left">
                            <div className="text-lg font-semibold text-gray-12">{season.name}</div>
                            <div className="text-sm font-medium text-gray-11/70">
                              {season.air_date && `${season.air_date.getFullYear()} ⋅ `}
                              {season.episode_count} Episodes
                            </div>
                            {season.overview && (
                              <p className="mt-2 line-clamp-1 text-sm text-gray-11 italic">{season.overview}</p>
                            )}
                          </div>
                        </div>
                        <ChevronDownIcon
                          className="mr-2 shrink-0 text-gray-11 transition-colors group-hover:text-gray-12 in-data-disabled:hidden"
                          aria-hidden
                        />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content className="rounded-b-lg border-x border-b border-gray-11/25">
                      {(() => {
                        const currentSeasonDetails = seasonDetails.get(season.season_number.toString());
                        if (!currentSeasonDetails) return <div className="p-4 text-gray-11">Loading...</div>;
                        return (
                          <ul className="divide-y divide-gray-11/25">
                            {currentSeasonDetails.episodes.map((episode) => (
                              <li key={episode.id} className="relative flex gap-4 p-4">
                                {episode.vote_average && (
                                  <Badge variant="secondary" className="absolute top-4 right-4">
                                    <StarIcon className="mr-1 size-3 text-gray-10" fill="currentColor" />
                                    {episode.vote_average}
                                  </Badge>
                                )}
                                {episode.still_path ? (
                                  <img
                                    width={142}
                                    height={80}
                                    className="h-20 w-auto rounded shadow-lg"
                                    src={getTmdbImage('still', episode.still_path, 'w300')}
                                    alt={`episode still of ${episode.name}`}
                                  />
                                ) : (
                                  <div className="grid h-20 w-[142px] place-items-center rounded-md bg-gray-4 shadow-lg">
                                    <ImageIcon className="size-6 text-gray-10" />
                                  </div>
                                )}
                                <div className="flex flex-col">
                                  <div className="flex items-baseline gap-2">
                                    <div className="font-medium text-gray-10">{episode.episode_number}.</div>
                                    <div className="flex flex-col">
                                      <div className="leading-none font-medium text-gray-12">{episode.name}</div>
                                      <div className="mt-0.5 text-sm font-medium text-gray-10">
                                        {episode.air_date && format(episode.air_date, 'MMM d, yyyy')}
                                        {episode.runtime && ` ⋅ ${formatMinutesToHHMM(episode.runtime)}`}
                                      </div>
                                    </div>
                                  </div>
                                  <p className="mt-4 text-sm text-gray-11 italic">{episode.overview}</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        );
                      })()}
                    </Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </div>
          )}
        </div>

        <div className="flex min-w-72 flex-col gap-2 md:w-80">
          <Card className="h-fit">
            {ratings.length > 0 && (
              <div className="flex justify-center gap-6 border-b border-gray-5 py-3">
                {ratings.map((rating, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger className="-m-1 flex items-center gap-1.5 rounded-md p-1">
                      <rating.logo className={rating.logoClass} />
                      <span className="text-sm font-medium text-gray-11">{rating.score}</span>
                    </TooltipTrigger>
                    <TooltipContent>{rating.tooltip}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            )}
            <dl className="divide-y divide-gray-5 text-sm">
              {seriesDetails.map(({ label, value }) => (
                <div key={label} className="flex items-baseline justify-between gap-4 px-4 py-3">
                  <dt className="font-medium whitespace-nowrap text-gray-12">{label}</dt>
                  <dd className="text-end text-gray-11">{value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-8">
        {series.credits.cast.length > 0 && (
          <CardCarousel title="Cast" link="cast">
            {series.credits.cast.map((person) => (
              <CarouselItem key={`${person.id}-${person.character}`}>
                <PersonCard person={person} title={person.character} />
              </CarouselItem>
            ))}
          </CardCarousel>
        )}

        {series.credits.crew.length > 0 && (
          <CardCarousel title="Crew" link="crew">
            {series.credits.crew.map((person) => (
              <CarouselItem key={`${person.id}-${person.job}`}>
                <PersonCard person={person} title={person.job} />
              </CarouselItem>
            ))}
          </CardCarousel>
        )}

        {series.recommendations.results.length > 0 && (
          <CardCarousel title="Recommendations" link="recommendations">
            {series.recommendations.results.map((series) => (
              <CarouselItem key={series.id}>
                <SeriesCard series={series} />
              </CarouselItem>
            ))}
          </CardCarousel>
        )}

        {series.similar.results.length > 0 && (
          <CardCarousel title="Similar Titles" link="similar">
            {series.similar.results.map((series) => (
              <CarouselItem key={series.id}>
                <SeriesCard series={series} />
              </CarouselItem>
            ))}
          </CardCarousel>
        )}
      </div>
    </PaddedLayout>
  );
}
