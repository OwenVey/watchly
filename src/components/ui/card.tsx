import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const cardVariants = cva('border bg-card backdrop-blur-xl transition-all', {
  variants: {
    rounded: {
      true: 'rounded-xl',
    },
    hover: {
      true: 'hover:border-accent hover:bg-muted',
    },
  },
  defaultVariants: {
    rounded: true,
    hover: false,
  },
});

interface CardProps extends useRender.ComponentProps<'div'>, VariantProps<typeof cardVariants> {}

export function Card(props: CardProps) {
  const { render, hover, ...otherProps } = props;

  const element = useRender({
    defaultTagName: 'div',
    render,
    props: mergeProps<'div'>({ className: cn(cardVariants({ hover })) }, otherProps),
  });

  return element;
}
