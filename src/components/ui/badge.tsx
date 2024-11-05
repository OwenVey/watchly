import { type VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border border-gray-6 px-2 py-0.5 text-xs font-medium transition-colors focus:ring-2 focus:ring-gray-12 focus:outline-none',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-gray-12 text-gray-1 shadow',
        secondary: 'border-gray-6 bg-gray-5 text-gray-12',
        outline: 'text-gray-12',
      },
      hover: {
        true: '',
      },
    },
    compoundVariants: [
      {
        variant: 'secondary',
        hover: true,
        class: 'hover:border-gray-8 hover:bg-gray-7',
      },
    ],
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, asChild = false, variant, hover = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'div';
    return <Comp ref={ref} className={cn(badgeVariants({ variant, hover }), className)} {...props} />;
  },
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
