import { Accordion } from '@base-ui/react/accordion';
import type { LanguageISO6391, TVSeason } from '@lorenzopant/tmdb';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useToggle } from '@uidotdev/usehooks';
import { format } from 'date-fns';
import { ChevronDownIcon, ImageIcon, StarIcon, TagIcon, TvIcon } from 'lucide-react';
import { useState } from 'react';
import * as v from 'valibot';
import { CardCarousel } from '@/components/card-carousel';
import { ImdbLogo } from '@/components/logos/imdb-logo';
import { RottenTomatoesLogo } from '@/components/logos/rotten-tomatoes-logo';
import { TmdbLogo } from '@/components/logos/tmdb-logo';
import { PaddedLayout } from '@/components/padded-layout';
import { PersonCard } from '@/components/person-card';
import { SeriesCard } from '@/components/series-card';
import { ShowMoreButton } from '@/components/show-more-button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CarouselItem } from '@/components/ui/carousel';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { tmdbApi } from '@/lib/api';
import { LANGUAGES_MAP } from '@/lib/constants';
import { formatMinutesToHHMM, voteAverageToPercentage } from '@/lib/utils';
import { omdbQueryOptions, seriesIdQueryOptions } from '@/query-options';
import { SeriesIdParamsSchema } from '@/schemas';

export const Route = createFileRoute('/(series)/series_/$seriesId')({
  params: {
    parse: (params) => v.parse(SeriesIdParamsSchema, params),
    stringify: (params) => ({ seriesId: params.seriesId.toString() }),
  },

  loader: async ({ context, params }) => {
    const series = await context.queryClient.ensureQueryData(seriesIdQueryOptions(params.seriesId));
    if (series.external_ids.imdb_id) {
      void context.queryClient.prefetchQuery(omdbQueryOptions(series.external_ids.imdb_id));
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { seriesId } = Route.useParams();

  const [seasonDetails, setSeasonDetails] = useState<Map<string, TVSeason>>(new Map());

  const { data: series } = useSuspenseQuery(seriesIdQueryOptions(seriesId));
  const { data: omdb } = useQuery(omdbQueryOptions(series.external_ids.imdb_id));

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
          to="/series"
          search={{ originalLanguage: series.original_language as LanguageISO6391 }}
          className="-m-1 rounded-md p-1 underline-offset-2 transition-colors hover:text-foreground hover:underline"
        >
          {LANGUAGES_MAP[series.original_language as LanguageISO6391]}
        </Link>
      ),
    },
    {
      label: 'Production Country',
      value: series.production_countries?.at(0)?.name,
    },
    {
      label: (series.production_companies?.length ?? 0) > 1 ? 'Studios' : 'Studio',
      value: series.production_companies ? (
        <ul>
          {series.production_companies.map(({ id, name }) => (
            <li key={id}>
              <Link
                from={Route.fullPath}
                to="/series"
                search={{ studios: [{ value: id.toString(), label: name }] }}
                className="-m-1 rounded-md p-1 underline-offset-2 transition-colors hover:text-foreground hover:underline"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null,
    },
    {
      label: (series.networks?.length ?? 0 > 1) ? 'Networks' : 'Network',
      value: series.networks ? (
        <ul>
          {series.networks.map(({ id, name }) => (
            <li key={id}>
              <Link
                from={Route.fullPath}
                to="/series"
                search={{ networks: [{ value: id.toString(), label: name }] }}
                className="-m-1 rounded-md p-1 underline-offset-2 transition-colors hover:text-foreground hover:underline"
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
      score: voteAverageToPercentage(series.vote_average),
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
            className="h-180 w-full object-cover opacity-15 blur-sm"
            src={series.backdrop_path}
            alt={`backdrop for ${series.name}`}
          />
          <div className="absolute right-0 -bottom-4 left-0 h-1/2 bg-linear-to-t from-background" />
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
                src={series.poster_path}
                alt={`movie poster for ${series.name}`}
                style={{ viewTransitionName: `series-poster-${series.id}` }}
              />
            ) : (
              <div className="grid aspect-2/3 h-auto w-48 place-items-center rounded-xl bg-card shadow-lg">
                <div className="grid size-24 place-items-center rounded-full border bg-muted">
                  <TvIcon className="size-8 text-muted-foreground" />
                </div>
              </div>
            )}
            <div className="flex flex-col items-center md:items-baseline">
              <h1 className="text-center md:text-left">
                <span className="text-3xl font-bold text-foreground">{series.name}</span>
                {series.first_air_date && (
                  <span className="ml-1 text-base font-medium text-muted-foreground">
                    {' '}
                    ({new Date(series.first_air_date).getFullYear()})
                  </span>
                )}
              </h1>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-start">
                {contentRating && (
                  <div className="rounded border p-0.5 text-xs leading-none font-medium text-foreground uppercase">
                    {contentRating}
                  </div>
                )}

                <div className="text-sm font-medium whitespace-nowrap text-foreground">
                  {series.seasons?.length ?? 0} Seasons
                </div>

                <div className="flex flex-wrap gap-1">
                  {series.genres.map(({ id, name }) => (
                    <Badge
                      key={id}
                      variant="secondary"
                      render={
                        <Link from={Route.fullPath} to="/series" search={{ genres: [id] }}>
                          {name}
                        </Link>
                      }
                    />
                  ))}
                </div>
              </div>

              <p className="mt-4 text-balance text-muted-foreground md:text-left">{series.overview}</p>

              <div>
                <ul className="mt-4 flex flex-wrap gap-1">
                  {series.keywords.results
                    .slice(0, showAllKeywords ? series.keywords.results.length : 10)
                    .map(({ id, name }) => (
                      <li key={id}>
                        <Badge
                          variant="secondary"
                          render={
                            <Link
                              from={Route.fullPath}
                              to="/series"
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
                {series.keywords.results.length > 10 && (
                  <ShowMoreButton className="mt-1" onClick={() => toggleShowAllKeywords()} showAll={showAllKeywords} />
                )}
              </div>
            </div>
          </div>
          {series.seasons && (
            <div>
              <h2 className="text-2xl leading-5 font-semibold text-foreground">Seasons</h2>
              <Accordion.Root
                multiple
                className="mt-3 flex flex-col gap-2"
                onValueChange={async (seasonNumbers) => {
                  for (const seasonNumber of seasonNumbers) {
                    if (!seasonDetails.has(seasonNumber)) {
                      const details = await tmdbApi.tv_seasons.details({
                        series_id: series.id,
                        season_number: seasonNumber,
                      });
                      setSeasonDetails((prev) => new Map(prev).set(seasonNumber, details));
                    }
                  }
                }}
              >
                {series.seasons?.map((season) => (
                  <Accordion.Item
                    key={season.id}
                    value={season.season_number.toString()}
                    disabled={season.episode_count === 0}
                  >
                    <Accordion.Header>
                      <Accordion.Trigger className="group relative flex w-full items-center justify-between overflow-hidden rounded-lg border bg-card p-2 backdrop-blur-xl transition-all hover:border-accent hover:bg-muted data-panel-open:rounded-b-none! data-disabled:pointer-events-none">
                        <Badge variant="secondary" className="absolute top-2 right-2">
                          <StarIcon className="mr-1 size-3 text-muted-foreground" fill="currentColor" />
                          {voteAverageToPercentage(season.vote_average)}
                        </Badge>

                        <div className="flex gap-4">
                          {season.poster_path ? (
                            <img
                              className="w-12 rounded-md shadow-lg"
                              width={76}
                              height={48}
                              src={season.poster_path}
                              alt={`season poster of ${season.name}`}
                            />
                          ) : (
                            <div className="grid aspect-2/3 h-auto w-12 place-items-center rounded-md bg-card shadow-lg">
                              <ImageIcon className="size-6 text-muted-foreground" />
                            </div>
                          )}
                          <div className="text-left">
                            <div className="text-lg font-semibold text-foreground">{season.name}</div>
                            <div className="text-sm font-medium text-muted-foreground">
                              {season.air_date && `${new Date(season.air_date).getFullYear()} ⋅ `}
                              {season.episode_count} Episodes
                            </div>
                            {season.overview && (
                              <p className="mt-2 line-clamp-1 text-sm text-muted-foreground italic">
                                {season.overview}
                              </p>
                            )}
                          </div>
                        </div>
                        <ChevronDownIcon
                          className="mr-2 shrink-0 text-muted-foreground transition group-hover:text-foreground group-data-panel-open:rotate-180 in-data-disabled:hidden"
                          aria-hidden
                        />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel className="rounded-b-lg border-x border-b bg-card/50">
                      {(() => {
                        const currentSeasonDetails = seasonDetails.get(season.season_number.toString());
                        if (!currentSeasonDetails) return <div className="p-4 text-muted-foreground">Loading...</div>;
                        return (
                          <ul className="divide-y">
                            {currentSeasonDetails.episodes.map((episode) => (
                              <li key={episode.id} className="relative flex gap-4 p-4">
                                <Badge variant="secondary" className="absolute top-4 right-4">
                                  <StarIcon className="mr-1 size-3 text-muted-foreground" fill="currentColor" />
                                  {voteAverageToPercentage(episode.vote_average)}
                                </Badge>

                                {episode.still_path ? (
                                  <img
                                    width={142}
                                    height={80}
                                    className="h-20 w-auto rounded shadow-lg"
                                    src={episode.still_path}
                                    alt={`episode still of ${episode.name}`}
                                  />
                                ) : (
                                  <div className="grid h-20 w-35.5 place-items-center rounded-md bg-card shadow-lg">
                                    <ImageIcon className="size-6 text-muted-foreground" />
                                  </div>
                                )}
                                <div className="flex flex-col">
                                  <div className="flex items-baseline gap-2">
                                    <div className="font-medium text-muted-foreground">{episode.episode_number}.</div>
                                    <div className="flex flex-col">
                                      <div className="leading-none font-medium text-foreground">{episode.name}</div>
                                      <div className="mt-0.5 text-sm font-medium text-muted-foreground">
                                        {episode.air_date && format(episode.air_date, 'MMM d, yyyy')}
                                        {episode.runtime && ` ⋅ ${formatMinutesToHHMM(episode.runtime)}`}
                                      </div>
                                    </div>
                                  </div>
                                  <p className="mt-4 text-sm text-muted-foreground italic">{episode.overview}</p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        );
                      })()}
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </div>
          )}
        </div>

        <div className="flex min-w-72 flex-col gap-2 md:w-80">
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
              {seriesDetails.map(({ label, value }) => (
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
