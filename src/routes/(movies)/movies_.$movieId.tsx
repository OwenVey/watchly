import { Image } from '@/components/image';
import { MovieCard } from '@/components/movie-card';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { tmdbApi } from '@/lib/api';
import { formatMinutesToHHMM, getTmdbImage } from '@/lib/utils';
import { createFileRoute, Link } from '@tanstack/react-router';
import { ClockIcon, UserRoundIcon } from 'lucide-react';

export const Route = createFileRoute('/(movies)/movies_/$movieId')({
  loader: async ({ params }) => {
    return tmdbApi('/movie/:movieId', {
      params,
      query: { append_to_response: ['recommendations', 'reviews', 'similar', 'credits'] },
    });
  },
  component: Movie,
});

function Movie() {
  const movie = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-6xl overflow-hidden p-4">
      {movie.backdrop_path && (
        <div className="absolute top-0 right-0 left-0 -z-10">
          <Image
            className="h-[30rem] w-full object-cover opacity-10"
            src={getTmdbImage('backdrop', movie.backdrop_path, 'w1280')}
            alt={`backdrop image for ${movie.title}`}
          />
          <div className="absolute right-0 bottom-0 left-0 h-1/2 bg-gradient-to-t from-gray-1" />
        </div>
      )}

      <div className="mt-4 flex gap-4">
        {movie.poster_path ? (
          <Image
            className="shad h-fit w-48 rounded-xl shadow-lg"
            src={getTmdbImage('poster', movie.poster_path, 'w342')}
            alt={`movie poster for ${movie.title}`}
          />
        ) : (
          <div>no poster</div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-12">
            {movie.title}
            {movie.release_date && (
              <span className="ml-1 text-base font-medium text-gray-11"> ({movie.release_date.getFullYear()})</span>
            )}
          </h1>
          <div className="mt-1 flex items-center">
            <div className="flex items-center gap-1">
              <ClockIcon className="size-4 text-gray-9" />
              <span className="text-sm font-medium">{formatMinutesToHHMM(movie.runtime)}</span>
            </div>
            <span className="mx-2 text-gray-9">|</span>
            <div className="flex gap-1">
              {movie.genres.map(({ name }) => (
                <Badge key={name} variant="secondary">
                  {name}
                </Badge>
              ))}
            </div>
          </div>
          {movie.tagline && <p className="mt-4 italic text-gray-11">&quot;{movie.tagline}&quot;</p>}
          <p className="mt-4 max-w-sm text-gray-11">{movie.overview}</p>
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
          className="size-24 rounded-full border-2 border-gray-5 object-cover"
          src={getTmdbImage('profile', profilePath, 'w185')}
          alt={`profile picture of ${name}`}
        />
      ) : (
        <div className="grid size-24 place-items-center rounded-full border-2 border-gray-5 bg-gray-4">
          <UserRoundIcon className="size-10 text-gray-11" />
        </div>
      )}
      <div className="mt-2 text-center font-medium text-gray-12">{name}</div>
      <div className="text-center text-sm text-gray-11">{role}</div>
    </Link>
  );
}
