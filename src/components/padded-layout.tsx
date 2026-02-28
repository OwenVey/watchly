import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function PaddedLayout({ className, children }: ComponentProps<'div'>) {
  return <div className={cn('mx-auto w-full max-w-6xl overflow-hidden p-4', className)}>{children}</div>;
}
