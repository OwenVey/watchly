import { Link } from '@tanstack/react-router';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type StatusPageProps = {
  code: string;
  title: string;
  description: string;
  details?: React.ReactNode;
  actionLabel?: string;
  actionTo?: '/';
};

export const StatusPage = ({
  code,
  title,
  description,
  details,
  actionLabel = 'Go back home',
  actionTo = '/',
}: StatusPageProps) => {
  return (
    <main className="grid min-h-full w-full place-items-center px-6 py-24 text-center sm:py-32 lg:px-8">
      <p className="text-base font-semibold text-primary">{code}</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-primary-foreground sm:text-7xl">
        {title}
      </h1>
      <p className="mt-6 text-lg font-medium text-pretty text-muted-foreground sm:text-xl/8">{description}</p>
      {details ? <div className="mt-4">{details}</div> : null}

      <Link to={actionTo} className={cn(buttonVariants({ variant: 'default' }), 'mt-10')}>
        {actionLabel}
      </Link>
    </main>
  );
};
