import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createFileRoute } from '@tanstack/react-router';

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
        <Input placeholder="Search" />
      </div>
    </div>
  );
}
