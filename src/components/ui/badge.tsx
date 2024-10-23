import { type VariantProps, cva } from 'class-variance-authority';
import type * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border border-gray-6 py-0.5 px-2 text-xs font-semibold transition-colors focus:ring-2 focus:ring-gray-1 focus:ring-offset-2 focus:outline-none',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-gray-12 text-gray-1 shadow',
        secondary: 'border-transparent bg-gray-5 text-gray-12',
        outline: 'text-gray-12',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
