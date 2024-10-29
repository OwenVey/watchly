import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, icon: Icon, ...props }, ref) => {
  return (
    <div className={cn('relative flex w-full items-center', className)}>
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 mr-2 flex items-center pl-3">
          <Icon className="size-5 text-gray-9" />
        </div>
      )}
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-md border border-gray-7 bg-gray-1/75 px-3 py-1 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-gray-12 placeholder:text-gray-9 hover:border-gray-8 focus-visible:border-gray-12 focus-visible:ring-1 focus-visible:ring-gray-12 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          Icon && 'pl-10',
        )}
        ref={ref}
        {...props}
      />
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
