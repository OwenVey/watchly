import { createFileRoute } from '@tanstack/react-router';
import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/test')({
  component: Test,
});

function Test() {
  return (
    <div className="flex flex-col gap-4 p-10">
      <div className="flex gap-2">
        <Button variant="default">Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="default">
          <SearchIcon className="mr-2 size-4" />
          Default
        </Button>
        <Button variant="outline">
          <SearchIcon className="mr-2 size-4" />
          Outline
        </Button>
        <Button variant="secondary">
          <SearchIcon className="mr-2 size-4" />
          Secondary
        </Button>
        <Button variant="ghost">
          <SearchIcon className="mr-2 size-4" />
          Ghost
        </Button>
        <Button variant="destructive">
          <SearchIcon className="mr-2 size-4" />
          Destructive
        </Button>
        <Button variant="link">
          <SearchIcon className="mr-2 size-4" />
          Link
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="default" loading>
          <SearchIcon className="mr-2 size-4" />
          Default
        </Button>
        <Button variant="outline" loading>
          <SearchIcon className="mr-2 size-4" />
          Outline
        </Button>
        <Button variant="secondary" loading>
          <SearchIcon className="mr-2 size-4" />
          Secondary
        </Button>
        <Button variant="ghost" loading>
          <SearchIcon className="mr-2 size-4" />
          Ghost
        </Button>
        <Button variant="destructive" loading>
          <SearchIcon className="mr-2 size-4" />
          Destructive
        </Button>
        <Button variant="link" loading>
          <SearchIcon className="mr-2 size-4" />
          Link
        </Button>
      </div>
      <div className="flex gap-2">
        <Input placeholder="Search" />
      </div>
    </div>
  );
}
