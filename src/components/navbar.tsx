import { ModeToggle } from '@/components/mode-toggle';
import { Link } from '@tanstack/react-router';

export function Navbar() {
  return (
    <nav className="flex items-center justify-between border-gray-6 border-b bg-background px-6 py-4">
      <Link to="/" className="font-bold text-2xl">
        Watchly
      </Link>

      <div className="space-x-4 text-sm">
        <Link
          to="/movies"
          className="rounded-md px-3 py-2 font-medium text-gray-11 text-sm hover:bg-gray-4 hover:text-gray-12 data-[status]:bg-primary-9 data-[status]:text-white"
        >
          Movies
        </Link>
        <Link
          to="/tv"
          className="rounded-md px-3 py-2 font-medium text-gray-11 text-sm hover:bg-gray-4 hover:text-gray-12 data-[status]:bg-primary-9 data-[status]:text-white"
        >
          TV Shows
        </Link>
      </div>

      <div>
        <ModeToggle />
      </div>
    </nav>
  );
}
