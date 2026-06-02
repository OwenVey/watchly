import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const cardVariants = cva('border bg-card backdrop-blur-xl transition-all', {
  defaultVariants: {
    hover: false,
    rounded: true,
  },
  variants: {
    hover: {
      true: 'hover:border-accent hover:bg-muted',
    },
    rounded: {
      true: 'rounded-xl',
    },
  },
});

interface CardProps extends useRender.ComponentProps<'div'>, VariantProps<typeof cardVariants> {}

export function Card(props: CardProps) {
  const { render, hover, ...otherProps } = props;

  const element = useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>({ className: cn(cardVariants({ hover })) }, otherProps),
    render,
  });

  return element;
}
