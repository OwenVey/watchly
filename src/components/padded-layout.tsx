import { cn } from '@/lib/utils';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export function PaddedLayout({ className, children }: Props) {
  return <div className={cn('mx-auto w-full max-w-6xl overflow-hidden p-4', className)}>{children}</div>;
}
