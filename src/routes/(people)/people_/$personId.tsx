import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useToggle } from '@uidotdev/usehooks';
import { differenceInYears } from 'date-fns';
import { UserRoundIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MovieCard } from '@/components/movie-card';
import { PaddedLayout } from '@/components/padded-layout';
import { SeriesCard } from '@/components/series-card';
import { ShowMoreButton } from '@/components/show-more-button';
import { cn, getTmdbImage } from '@/lib/utils';
import { personIdQueryOptions } from '@/query-options';

export const Route = createFileRoute('/(people)/people_/$personId')({
  loader: async ({ context, params }) => context.queryClient.ensureQueryData(personIdQueryOptions(params.personId)),
  component: Person,
});

function Person() {
  const { personId } = Route.useParams();
  const { data: person } = useSuspenseQuery(personIdQueryOptions(personId));
  const profileTransitionName = `person-profile-${person.id}`;

  const [showEntireBio, toggleShowEntireBio] = useToggle(false);

  const cast = Array.from(
    person.combined_credits.cast
      .reduce((acc, result) => {
        if (!acc.has(result.id)) acc.set(result.id, { ...result, characters: [] });
        if (result.character) acc.get(result.id)!.characters.push(result.character);
        return acc;
      }, new Map<number, (typeof person.combined_credits.cast)[number] & { characters: string[] }>())
      .values(),
  );

  const crew = Array.from(
    person.combined_credits.crew
      .reduce((acc, result) => {
        if (!acc.has(result.id)) acc.set(result.id, { ...result, jobs: [] });
        if (result.job) acc.get(result.id)!.jobs.push(result.job);
        return acc;
      }, new Map<number, (typeof person.combined_credits.crew)[number] & { jobs: string[] }>())
      .values(),
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Filter out cast members without a valid backdrop_path
  const validCast = cast.filter((result) => result.backdrop_path);

  // Effect to change the current index every few seconds
  useEffect(() => {
    if (validCast.length === 0) return; // Exit if there are no valid backdrops

    const interval = setInterval(() => {
      setFade(false); // Start fading out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % validCast.length); // Move to the next index
        setFade(true); // Start fading in
      }, 1000); // Duration of fade out
    }, 5000); // Duration to show each image

    return () => clearInterval(interval);
  }, [validCast.length]);

  return (
    <PaddedLayout>
      {validCast.length > 0 && (
        <div className="absolute top-0 right-0 left-0 -z-10">
          <img
            className={cn(
              'h-180 w-full object-cover blur-sm transition-opacity duration-1000',
              fade ? 'opacity-15' : 'opacity-0',
            )}
            src={
              validCast[currentIndex].backdrop_path
                ? getTmdbImage('backdrop', validCast[currentIndex].backdrop_path, 'w1280')
                : undefined
            }
            alt={`backdrop image`}
          />
          <div className="absolute right-0 -bottom-4 left-0 h-1/2 bg-linear-to-t from-background" />
        </div>
      )}

      <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
        {person.profile_path ? (
          <img
            className="aspect-2/3 w-48 rounded-xl shadow-lg"
            src={getTmdbImage('profile', person.profile_path, 'h632')}
            alt={`profile picture for ${person.name}`}
            style={{ viewTransitionName: profileTransitionName }}
          />
        ) : (
          <div className="grid aspect-2/3 h-auto w-48 place-items-center rounded-xl bg-card shadow-lg">
            <div className="grid size-24 place-items-center rounded-full border bg-muted">
              <UserRoundIcon className="size-8 text-muted-foreground" />
            </div>
          </div>
        )}
        <div className="flex max-w-xl flex-col items-center md:items-baseline">
          <h1 className="text-3xl font-bold text-foreground">{person.name}</h1>
          <div className="text-muted-foreground">
            Born {person.birthday.toLocaleDateString()} ({differenceInYears(new Date(), person.birthday)} years old)
          </div>
          <div className="text-muted-foreground">{person.place_of_birth}</div>

          {person.biography && (
            <div>
              <p className={cn('mt-4 text-sm text-muted-foreground', !showEntireBio && 'line-clamp-[8]')}>
                {person.biography}
              </p>
              <ShowMoreButton onClick={() => toggleShowEntireBio()} className="mt-1" showAll={showEntireBio} />
            </div>
          )}
        </div>
      </div>

      {cast.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-foreground">Appearances</h2>
          <ul className="mt-2 grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
            {cast.map((result) => (
              <li key={result.id}>
                {result.media_type === 'movie' && <MovieCard movie={result} showBadge />}
                {result.media_type === 'tv' && <SeriesCard series={result} showBadge />}
                {result.characters.length > 0 && (
                  <div className="mt-1 line-clamp-1 text-center text-xs font-medium text-muted-foreground">
                    as {result.characters.join(' / ')}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {crew.length > 0 && (
        <div>
          <h2 className="mt-12 text-2xl font-semibold text-foreground">Crew</h2>
          <ul className="mt-2 grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
            {crew.map((result) => (
              <li key={result.id}>
                {result.media_type === 'movie' && <MovieCard movie={result} showBadge />}
                {result.media_type === 'tv' && <SeriesCard series={result} showBadge />}
                {result.jobs.length > 0 && (
                  <div className="mt-1 line-clamp-1 text-center text-xs font-medium text-muted-foreground">
                    {result.jobs.join(' / ')}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </PaddedLayout>
  );
}
