import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import { LoaderIcon } from 'lucide-react';
import * as React from 'react';

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm ring-offset-gray-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-12 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary-9 text-white shadow hover:bg-primary-10 active:bg-primary-11',
        outline: 'border border-gray-7 shadow-sm hover:bg-gray-3 active:bg-gray-4',
        secondary: 'bg-gray-3 shadow-sm hover:bg-gray-4 active:bg-gray-5',
        ghost: 'hover:bg-gray-3 active:bg-gray-4',
        link: 'underline-offset-4 hover:underline ',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, loading = false, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), '')}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        <span className="grid place-items-center">
          {loading && <LoaderIcon className="absolute size-4 animate-spin" />}
          <span className={cn(loading && 'opacity-0')}>{children}</span>
        </span>
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
