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
        'group flex items-center justify-center gap-1 rounded border border-gray-6 bg-gray-4 px-3 py-1 text-xs font-medium text-gray-11 transition-colors hover:border-gray-7 hover:bg-gray-5 hover:text-gray-12 active:bg-gray-6',
        className,
      )}
      {...buttonProps}
    >
      <ChevronsDownIcon
        className={cn('size-4 text-gray-10 transition-colors group-hover:text-gray-11', showAll && 'rotate-180')}
      />
      {showAll ? 'Show Less' : 'Show More'}
      <ChevronsDownIcon
        className={cn('size-4 text-gray-10 transition-colors group-hover:text-gray-11', showAll && 'rotate-180')}
      />
    </button>
  );
}
