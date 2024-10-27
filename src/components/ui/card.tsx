import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';

export const cardVariants = cva('border border-gray-11/15 bg-gray-3/60 backdrop-blur-xl', {
  variants: {
    rounded: {
      true: 'rounded-xl',
    },
    hover: {
      true: 'hover:border-gray-11/35 hover:bg-gray-3/90',
    },
  },
  defaultVariants: {
    rounded: true,
    hover: false,
  },
});

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  hover?: boolean;
}
export function Card({ asChild = false, hover = false, className, ...rest }: Props) {
  const Comp = asChild ? Slot : 'div';

  return <Comp {...rest} className={cn(cardVariants({ hover }), className)} />;
}
