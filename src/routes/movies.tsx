import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { movieApi } from '@/lib/api';
import {
  Link,
  createFileRoute,
  defer,
  useNavigate,
} from '@tanstack/react-router';
import { fallback, zodSearchValidator } from '@tanstack/router-zod-adapter';
import { ChevronLeft, ChevronRight, Search, Star } from 'lucide-react';
import { z } from 'zod';

const movieSearchSchema = z.object({
  page: fallback(z.number().min(1), 1).default(1),
  adult: fallback(z.boolean(), false).default(false),
});

export const Route = createFileRoute('/movies')({
  component: Movies,
  loaderDeps: ({ search: { page, adult } }) => ({ page, adult }),
  loader: async ({ deps }) => {
    const [movies, genresResponse] = await Promise.all([
      movieApi('/discover/movie', {
        query: {
          include_adult: deps.adult,
          sort_by: 'popularity.desc',
          page: deps.page,
        },
      }),
      movieApi('/genre/movie/list'),
    ]);

    return { movies, genres: genresResponse.genres };
  },
  validateSearch: zodSearchValidator(movieSearchSchema),
});

function Movies() {
  const { movies, genres } = Route.useLoaderData();
  const { page, adult } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar with filters */}
      <aside className="w-64 border-r p-6 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        {/* Search input */}
        <div className="mb-4">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search titles..."
              className="pl-8"
            />
          </div>
        </div>

        {/* Genre filter */}
        <div className="mb-4">
          <Label htmlFor="genre">Genre</Label>
          <Select>
            <SelectTrigger id="genre">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genre) => (
                <SelectItem key={genre.id} value={genre.id.toString()}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year range filter */}
        <div className="mb-4">
          <Label>Year Range</Label>
          <Slider defaultValue={[1990, 2023]} min={1900} max={2023} step={1} />
          <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>1990</span>
            <span>2023</span>
          </div>
        </div>

        {/* Rating filter */}
        <div className="mb-4">
          <Label htmlFor="rating">Minimum Rating</Label>
          <Select>
            <SelectTrigger id="rating">
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1+ Star</SelectItem>
              <SelectItem value="2">2+ Stars</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Adult content filter */}
        <div className="flex items-center space-x-2 mb-4">
          <Switch
            id="adult-content"
            checked={adult}
            onCheckedChange={(adult) =>
              navigate({ search: (prev) => ({ ...prev, adult }) })
            }
          />
          <Label htmlFor="adult-content">Include Adult Content</Label>
        </div>

        <div className="mb-4">
          <Label htmlFor="duration">Max Duration (minutes)</Label>
          <Input type="number" id="duration" placeholder="e.g. 120" />
        </div>

        {/* Apply filters button */}
        <Button className="w-full">Apply Filters</Button>
      </aside>

      {/* Results area */}
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Movies</h1>
          <div className="flex space-x-2">
            <Button asChild disabled={page === 1} variant="outline" size="icon">
              <Link
                to="."
                search={(prev) => ({
                  ...prev,
                  page: prev.page - 1,
                })}
              >
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="icon">
              <Link
                to="."
                search={(prev) => ({
                  ...prev,
                  page: prev.page + 1,
                })}
              >
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Grid of movie/show results */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {movies.results.map((movie) => (
            <div key={movie.id} className="space-y-2">
              <div className="aspect-[2/3] bg-muted rounded-lg overflow-hidden">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}}`}
                  alt="movie poster"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold truncate">{movie.title}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 mr-1 fill-primary" />
                <span>{movie.vote_average}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
