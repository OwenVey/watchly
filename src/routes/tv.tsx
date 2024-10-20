import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createFileRoute } from '@tanstack/react-router';
import { SearchIcon } from 'lucide-react';

export const Route = createFileRoute('/tv')({
  component: AboutComponent,
});

function AboutComponent() {
  return (
    <div className="flex flex-col gap-4 p-10">
      <div className="flex gap-4">
        <Button variant="default">Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex gap-4">
        <Button variant="default">
          <SearchIcon className="size-4 mr-2" />
          Default
        </Button>
        <Button variant="outline">
          <SearchIcon className="size-4 mr-2" />
          Outline
        </Button>
        <Button variant="secondary">
          <SearchIcon className="size-4 mr-2" />
          Secondary
        </Button>
        <Button variant="ghost">
          <SearchIcon className="size-4 mr-2" />
          Ghost
        </Button>
        <Button variant="link">
          <SearchIcon className="size-4 mr-2" />
          Link
        </Button>
      </div>
      <div className="flex gap-4">
        <Button variant="default" loading>
          <SearchIcon className="size-4 mr-2" />
          Default
        </Button>
        <Button variant="outline" loading>
          <SearchIcon className="size-4 mr-2" />
          Outline
        </Button>
        <Button variant="secondary" loading>
          <SearchIcon className="size-4 mr-2" />
          Secondary
        </Button>
        <Button variant="ghost" loading>
          <SearchIcon className="size-4 mr-2" />
          Ghost
        </Button>
        <Button variant="link" loading>
          <SearchIcon className="size-4 mr-2" />
          Link
        </Button>
      </div>
      <div className="flex gap-4">
        <Input placeholder="Search" />
      </div>
    </div>
  );
}
