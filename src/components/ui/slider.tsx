import { Slider as SliderPrimitive } from 'radix-ui';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  labelPosition?: 'top' | 'bottom';
  label?: (value: number | undefined) => React.ReactNode;
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, label, labelPosition = 'bottom', ...props }, ref) => {
    const initialValue = Array.isArray(props.value) ? props.value : [props.min, props.max];

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn('relative flex w-full touch-none items-center select-none', className)}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-7">
          <SliderPrimitive.Range className="absolute h-full bg-primary-9" />
        </SliderPrimitive.Track>

        {initialValue.map((value, index) => (
          <React.Fragment key={index}>
            <SliderPrimitive.Thumb
              className={cn(
                'relative block size-4 rounded-full border-2 border-primary-9 bg-gray-1 shadow transition-colors focus-visible:ring-1 focus-visible:ring-gray-12 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
                props.orientation === 'vertical' ? 'cursor-ns-resize' : 'cursor-ew-resize',
              )}
            >
              {label && (
                <span
                  className={cn(
                    'absolute flex w-full text-xs whitespace-nowrap text-gray-12',
                    labelPosition === 'top' && '-top-7',
                    labelPosition === 'bottom' && 'top-4',
                    index === 0 && 'justify-start',
                    index === 1 && 'justify-end',
                  )}
                >
                  {label(value)}
                </span>
              )}
            </SliderPrimitive.Thumb>
          </React.Fragment>
        ))}
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
