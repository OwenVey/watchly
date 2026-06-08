import { PaddedLayout } from '@/components/padded-layout';
import { Skeleton } from '@/components/ui/skeleton';

export function GridPending() {
  return (
    <PaddedLayout>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-2 h-5 w-36" />
      <div className="mt-2 grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
        {Array.from({ length: 24 }).map((_, index) => (
          <Skeleton className="aspect-2/3 w-full border" key={`placeholder-${index}`} />
        ))}
      </div>
    </PaddedLayout>
  );
}

export function FullPageGridPending() {
  return (
    <div className="w-full">
      <ul className="grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4 p-4">
        {Array.from({ length: 60 }).map((_, index) => (
          <li key={`placeholder-${index}`}>
            <Skeleton className="aspect-2/3 w-full border" />
          </li>
        ))}
      </ul>
    </div>
  );
}
