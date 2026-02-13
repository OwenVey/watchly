import { composeRefs } from '@radix-ui/react-compose-refs';
import { type PopoverProps } from '@radix-ui/react-popover';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { skipToken, useQuery } from '@tanstack/react-query';
import { useCommandState } from 'cmdk';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import * as React from 'react';
import { cn, useContextSafely } from '@/lib/utils';
import { Badge } from './badge';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

export type Option = {
  value: string;
  label: string;
};

interface MultiselectContextApi {
  selection: Option[];
  select: (val: Option) => void;
  unselect: (val: Option) => void;
  open: boolean;
  setOpen: (val: boolean) => void;
}

const MultiselectContext = React.createContext<MultiselectContextApi | null>(null);

interface MultiselectProps extends PopoverProps {
  id?: string;
  placeholder?: string;
  value: Option[];
  onValueChange: (value: Option[]) => void;
  defaultValue?: Option[];
  className?: string;
  options?: Option[];
  onSearch?: (query: string) => Promise<Option[]>;
}

const Multiselect = React.forwardRef<HTMLDivElement, MultiselectProps>(
  ({
    id,
    placeholder,
    defaultOpen = false,
    open,
    onOpenChange,
    defaultValue = [],
    value,
    onValueChange,
    options,
    onSearch,
    ...otherProps
  }) => {
    const [_selection, _setSelection] = useControllableState({
      prop: value,
      defaultProp: defaultValue,
      onChange: onValueChange,
    });

    const [_open, _setOpen] = useControllableState({
      prop: open,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    });

    const [search, setSearch] = React.useState('');

    const { data: searchOptions, isFetching } = useQuery({
      queryKey: [id, search],
      queryFn: onSearch ? () => onSearch(search) : skipToken,
      enabled: onSearch ? search.length > 0 : false,
    });

    return (
      <MultiselectContext.Provider
        value={{
          selection: _selection ?? [],
          select: (option) => _setSelection((prev) => [...(prev ?? []), option]),
          unselect: (option) => _setSelection((prev) => (prev ?? []).filter(({ value }) => value !== option.value)),
          open: _open ?? false,
          setOpen: _setOpen,
        }}
      >
        <Popover {...otherProps} open={_open} onOpenChange={_setOpen}>
          <MultiselectTrigger id={id} placeholder={placeholder} grow>
            <MultiselectBadgeList>
              {_selection?.map((option) => (
                <MultiselectBadge key={option.value} option={option} />
              ))}
            </MultiselectBadgeList>
          </MultiselectTrigger>
          <MultiselectContent>
            <MultiselectInput
              placeholder="Search..."
              {...(onSearch && { value: search, onValueChange: setSearch, loading: isFetching })}
            />
            <MultiselectEmpty>No results</MultiselectEmpty>
            {[...(options ?? []), ...(searchOptions ?? [])].map((option) => (
              <MultiselectItem key={option.value} option={option} />
            ))}
          </MultiselectContent>
        </Popover>
      </MultiselectContext.Provider>
    );
  },
);
Multiselect.displayName = 'Multiselect';

interface MultiselectTriggerApi {
  grow: boolean;
}

const MultiselectTriggerContext = React.createContext<MultiselectTriggerApi | null>(null);

interface MultiselectTriggerProps extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {
  placeholder?: string;
  grow?: boolean;
}

const MultiselectTrigger = React.forwardRef<React.ElementRef<typeof PopoverTrigger>, MultiselectTriggerProps>(
  ({ children, className, placeholder = 'Search...', grow = false, ...otherProps }, ref) => {
    const multiselect = useContextSafely(MultiselectContext);
    const mask = grow
      ? undefined
      : 'linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) calc(100% - 24px), rgba(255, 255, 255, 0) 100%)';
    return (
      <MultiselectTriggerContext.Provider value={{ grow }}>
        <PopoverTrigger
          {...otherProps}
          ref={ref}
          className={cn(
            'border-gray-7 bg-gray-1 ring-offset-gray-1 placeholder:text-gray-9 hover:border-gray-8 relative flex h-fit w-full items-center overflow-hidden rounded-md border text-sm whitespace-nowrap shadow-none focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
            className,
          )}
        >
          <div
            className={cn('relative h-full min-w-0 flex-1 overflow-auto rounded-l-[inherit] p-1.25')}
            style={{ mask, WebkitMask: mask }}
          >
            {multiselect.selection.length === 0 ? (
              <div className="flex h-6 items-center px-1.5">
                <span className="text-gray-9">{placeholder}</span>
              </div>
            ) : (
              children
            )}
          </div>
          <div className="rounded-r-[inherit] pr-2 pl-1">
            <ChevronsUpDownIcon className="text-gray-9 h-4 w-4" />
          </div>
        </PopoverTrigger>
      </MultiselectTriggerContext.Provider>
    );
  },
);
MultiselectTrigger.displayName = 'MultiselectTrigger';

const MultiselectBadgeList = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  ({ children, className, ...otherProps }, ref) => {
    const trigger = useContextSafely(MultiselectTriggerContext);
    return (
      <div
        ref={ref}
        className={cn('flex flex-wrap gap-1', !trigger.grow && 'w-max flex-nowrap', className)}
        {...otherProps}
      >
        {children}
      </div>
    );
  },
);
MultiselectBadgeList.displayName = 'MultiselectBadgeList';

interface MultiselectBadgeProps extends React.ComponentPropsWithoutRef<typeof Badge> {
  option: Option;
}

const MultiselectBadge = React.forwardRef<React.ElementRef<typeof Badge>, MultiselectBadgeProps>(
  ({ option, className, ...otherProps }, ref) => {
    const multiselect = useContextSafely(MultiselectContext);
    return (
      <Badge ref={ref} className={cn('h-6 gap-1', className)} {...otherProps}>
        {option.label}
        <button
          aria-label={`Unselect ${option.label}`}
          className="text-gray-8 ring-offset-gray-1 hover:bg-gray-11 hover:text-gray-1 focus-visible:ring-gray-1 -mr-1.5 grid size-4 place-items-center rounded-full transition-colors outline-none focus-visible:ring-2"
          onClick={(e) => {
            multiselect.unselect(option);
            e.stopPropagation();
          }}
        >
          <XIcon className="size-3" />
        </button>
      </Badge>
    );
  },
);
MultiselectBadge.displayName = 'MultiselectBadge';

const MultiselectInput = React.forwardRef<
  React.ElementRef<typeof CommandInput>,
  React.ComponentPropsWithoutRef<typeof CommandInput>
>(({ placeholder = 'Search...', value, defaultValue, onValueChange, ...otherProps }, forwardedRef) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const multiselect = useContextSafely(MultiselectContext);
  const content = useContextSafely(MultiselectContentContext);
  const activeValue = useCommandState((state) => state.value);

  const [search, setSearch] = useControllableState({
    prop: value,
    defaultProp: defaultValue as string,
    onChange: onValueChange,
  });

  React.useEffect(() => {
    if (multiselect.open) {
      setSearch('');
    }
  }, [multiselect.open]);

  // // fix broken cmdk accessibility
  React.useEffect(() => {
    if (ref.current) {
      const activeItemEl = content.rootRef.current?.querySelector(
        `[cmdk-item=""][data-value="${encodeURIComponent(activeValue)}"]`,
      );
      if (activeItemEl) {
        ref.current.setAttribute('aria-activedescendant', activeItemEl.id);
      }
    }
  }, [activeValue]);

  return (
    <div className="-mt-1 mb-1">
      <CommandInput
        ref={forwardedRef ? composeRefs(forwardedRef, ref) : ref}
        placeholder={placeholder}
        value={search}
        onValueChange={setSearch}
        className="h-9 border-none px-1.5 text-sm"
        onKeyUp={(e) => {
          if (e.key === ' ') {
            e.preventDefault();
          }
        }}
        onBlur={(e) => {
          e.currentTarget.focus();
        }}
        {...otherProps}
      />
    </div>
  );
});
MultiselectInput.displayName = 'MultiselectInput';

const AriaDescendantFix = ({ listRef }: { listRef: React.RefObject<HTMLDivElement | null> }) => {
  const activeValue = useCommandState((state) => state.value);

  // fix broken cmdk accessibility
  React.useEffect(() => {
    if (listRef.current) {
      const activeItemEl = listRef.current?.querySelector(
        `[cmdk-item=""][data-value="${encodeURIComponent(activeValue)}"]`,
      );
      if (activeItemEl) {
        listRef.current.setAttribute('aria-activedescendant', activeItemEl.id);
      }
    }
  }, [activeValue]);

  return null;
};

interface MultiselectContentApi {
  rootRef: React.RefObject<HTMLDivElement | null>;
}

const MultiselectContentContext = React.createContext<MultiselectContentApi | null>(null);

const MultiselectContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ children, className, align = 'end', ...otherProps }, ref) => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  return (
    <MultiselectContentContext.Provider value={{ rootRef }}>
      <PopoverContent
        ref={ref}
        className={cn('w-(--radix-popover-trigger-width) p-0', className)}
        align={align}
        {...otherProps}
        render={
          <Command
            ref={rootRef}
            className={cn('overflow-visible', className)}
            role="listbox"
            filter={(value, search, keywords) => {
              const extendValue = value + ' ' + keywords?.join(' ');
              if (extendValue.toLowerCase().includes(search.toLowerCase())) return 1;
              return 0;
            }}
          >
            <AriaDescendantFix listRef={rootRef} />
            <CommandList ref={listRef} className="p-1">
              {children}
            </CommandList>
          </Command>
        }
      />
    </MultiselectContentContext.Provider>
  );
});
MultiselectContent.displayName = 'MultiselectContent';

interface MultiselectItemProps extends React.ComponentPropsWithoutRef<typeof CommandItem> {
  option: Option;
}

const MultiselectItem = React.forwardRef<React.ElementRef<typeof CommandItem>, MultiselectItemProps>(
  ({ children, className, option, onSelect, ...otherProps }, ref) => {
    const multiselect = useContextSafely(MultiselectContext);
    const checked = multiselect.selection.some(({ value }) => value === option.value);
    return (
      <CommandItem
        ref={ref}
        role="option"
        value={option.value}
        onSelect={(value) => {
          if (checked) {
            multiselect.unselect(option);
          } else {
            multiselect.select(option);
          }
          onSelect?.(value);
        }}
        className={cn(className)}
        aria-checked={checked}
        keywords={[option.label]}
        {...otherProps}
      >
        {option.label}
        {checked && <CheckIcon className="absolute right-2 h-4 w-4" />}
      </CommandItem>
    );
  },
);
MultiselectItem.displayName = 'MultiselectItem';

const MultiselectEmpty = React.forwardRef<
  React.ElementRef<typeof CommandEmpty>,
  React.ComponentPropsWithoutRef<typeof CommandEmpty>
>(({ children, className, ...otherProps }, ref) => {
  return (
    <CommandEmpty ref={ref} className={cn('py-6 text-center text-sm text-muted-foreground', className)} {...otherProps}>
      {children}
    </CommandEmpty>
  );
});
MultiselectEmpty.displayName = 'MultiselectEmpty';

export { Multiselect };
