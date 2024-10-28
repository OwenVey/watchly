import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/(movies)/movies_/_padded')({
  component: () => (
    <div className="mx-auto w-full max-w-6xl overflow-hidden p-4">
      <Outlet />
    </div>
  ),
});
