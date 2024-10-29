import { Card } from '@/components/ui/card';
import { getTmdbImage } from '@/lib/utils';
import { Route as PersonIdRoute } from '@/routes/(people)/people_/$personId';
import type { Person } from '@/types';
import { Link } from '@tanstack/react-router';
import { UserRoundIcon } from 'lucide-react';

type Props = {
  person: Person;
  title?: string | null;
};

export function PersonCard({ person, title }: Props) {
  return (
    <Card asChild hover>
      <Link
        to={PersonIdRoute.to}
        params={{ personId: person.id.toString() }}
        preloadDelay={500}
        className="flex aspect-2/3 flex-col items-center justify-center p-2 transition-all hover:scale-105"
      >
        {person.profile_path ? (
          <img
            className="size-24 rounded-full border border-gray-5 object-cover"
            src={getTmdbImage('profile', person.profile_path, 'w185')}
            alt={`profile picture of ${person.name}`}
          />
        ) : (
          <div className="grid size-24 place-items-center rounded-full border border-gray-5 bg-gray-4">
            <UserRoundIcon className="size-8 text-gray-11" />
          </div>
        )}
        <div className="mt-2 text-center font-medium text-gray-12">{person.name}</div>
        {title && <div className="text-center text-sm text-gray-11">{title}</div>}
      </Link>
    </Card>
  );
}
