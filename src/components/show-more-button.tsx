import { ChevronsDownIcon } from 'lucide-react';
import { type ComponentProps } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ShowMoreButtonProps extends ComponentProps<'button'> {
  showAll: boolean;
}

export function ShowMoreButton({ showAll, className, ...buttonProps }: ShowMoreButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({
          variant: 'outline',
          className: 'group gap-1 px-3 py-1 h-auto text-xs',
        }),
        className,
      )}
      {...buttonProps}
    >
      <ChevronsDownIcon
        className={cn(
          'size-4 text-muted-foreground transition-colors group-hover:text-secondary-foreground',
          showAll && 'rotate-180',
        )}
      />
      {showAll ? 'Show Less' : 'Show More'}
      <ChevronsDownIcon
        className={cn(
          'size-4 text-muted-foreground transition-colors group-hover:text-secondary-foreground',
          showAll && 'rotate-180',
        )}
      />
    </button>
  );
}
