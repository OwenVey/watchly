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
      <div className="flex gap-4">
        <Button variant="default">Default</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="glass">Glass</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      <div className="flex gap-4">
        <Button variant="default">
          <SearchIcon className="mr-2 size-4" />
          Default
        </Button>
        <Button variant="outline">
          <SearchIcon className="mr-2 size-4" />
          Outline
        </Button>
        <Button variant="glass">
          <SearchIcon className="mr-2 size-4" />
          Glass
        </Button>
        <Button variant="ghost">
          <SearchIcon className="mr-2 size-4" />
          Ghost
        </Button>
        <Button variant="link">
          <SearchIcon className="mr-2 size-4" />
          Link
        </Button>
      </div>
      <div className="flex gap-4">
        <Button variant="default" loading>
          <SearchIcon className="mr-2 size-4" />
          Default
        </Button>
        <Button variant="outline" loading>
          <SearchIcon className="mr-2 size-4" />
          Outline
        </Button>
        <Button variant="glass" loading>
          <SearchIcon className="mr-2 size-4" />
          Glass
        </Button>
        <Button variant="ghost" loading>
          <SearchIcon className="mr-2 size-4" />
          Ghost
        </Button>
        <Button variant="link" loading>
          <SearchIcon className="mr-2 size-4" />
          Link
        </Button>
      </div>
      <div className="flex gap-4">
        <Input placeholder="Search" />
      </div>
    </div>
  );
}
