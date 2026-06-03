import type { Credit, PersonResultItem } from '@lorenzopant/tmdb';
import { Link } from '@tanstack/react-router';
import { UserRoundIcon } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { getTmdbImage } from '@/lib/utils';
import { Route as PersonIdRoute } from '@/routes/(people)/people_/$personId';

interface Props {
  person: PersonResultItem | Credit;
  title?: string | null;
}

export function PersonCard({ person, title }: Props) {
  const [isTransitionTarget, setIsTransitionTarget] = useState(false);
  const profileTransitionName = `person-profile-${person.id}`;

  return (
    <Card
      hover
      render={
        <Link
          to={PersonIdRoute.to}
          params={{ personId: person.id }}
          preloadDelay={500}
          viewTransition
          onClick={() => {
            setIsTransitionTarget(true);
          }}
          className="flex aspect-2/3 flex-col items-center justify-center p-2 transition-all hover:scale-105"
        >
          {person.profile_path ? (
            <img
              className="size-24 rounded-full border object-cover"
              src={getTmdbImage('profile', person.profile_path, 'w185')}
              alt={`profile for ${person.name}`}
              style={{
                viewTransitionName: isTransitionTarget ? profileTransitionName : 'none',
              }}
            />
          ) : (
            <div className="grid size-24 place-items-center rounded-full border bg-muted">
              <UserRoundIcon className="size-8 text-muted-foreground" />
            </div>
          )}
          <div className="mt-2 text-center font-medium text-foreground">{person.name}</div>
          {title && <div className="text-center text-sm text-muted-foreground">{title}</div>}
        </Link>
      }
    />
  );
}
