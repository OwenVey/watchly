import { Card } from '@/components/ui/card';
import { getTmdbImage } from '@/lib/utils';
import { Link } from '@tanstack/react-router';
import { UserRoundIcon } from 'lucide-react';

export function PersonCard({
  profilePath,
  name,
  role,
}: {
  profilePath: string | null;
  name: string;
  role?: string | null;
}) {
  return (
    <Card asChild hover>
      <Link to="/" className="flex aspect-2/3 flex-col items-center justify-center p-2 transition-all hover:scale-105">
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
        {role && <div className="text-center text-sm text-gray-11">{role}</div>}
      </Link>
    </Card>
  );
}
