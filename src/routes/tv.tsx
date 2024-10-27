import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/tv')({
  component: AboutComponent,
});

function AboutComponent() {
  return <div>TV Shows</div>;
}
