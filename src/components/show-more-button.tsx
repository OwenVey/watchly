import { cn } from '@/lib/utils';
import { ChevronsDownIcon } from 'lucide-react';
import React from 'react';

interface ShowMoreButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showAll: boolean;
}

export function ShowMoreButton({ showAll, className, ...buttonProps }: ShowMoreButtonProps) {
  return (
    <button
      className={cn(
        'group flex items-center gap-1 text-sm text-gray-11 transition-colors hover:text-gray-12',
        className,
      )}
      {...buttonProps}
    >
      <ChevronsDownIcon
        className={cn('size-4 text-gray-9 transition-colors group-hover:text-gray-11', showAll && 'rotate-180')}
      />
      {showAll ? 'Show Less' : 'Show More'}
      <ChevronsDownIcon
        className={cn('size-4 text-gray-9 transition-colors group-hover:text-gray-11', showAll && 'rotate-180')}
      />
    </button>
  );
}
