import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import { LoaderIcon } from 'lucide-react';
import * as React from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-gray-1 transition-colors focus-visible:ring-2 focus-visible:ring-gray-12 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary-9 text-white shadow hover:bg-primary-10 active:bg-primary-11',
        outline:
          'border border-gray-7 bg-gray-1 text-gray-12 shadow-sm hover:border-gray-8 hover:bg-gray-3 active:bg-gray-4',
        secondary: 'bg-gray-3 text-gray-12 shadow-sm hover:bg-gray-4 active:bg-gray-5',
        ghost: 'text-gray-12 hover:bg-gray-4 active:bg-gray-5',
        link: 'text-gray-12 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 py-2 px-4',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
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
        className={cn(buttonVariants({ variant, size, className }), loading && 'text-transparent [&>*]:opacity-0')}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        <>
          {loading && <LoaderIcon data-loader className="absolute size-4 animate-spin text-white! opacity-100!" />}
          {children}
        </>
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
