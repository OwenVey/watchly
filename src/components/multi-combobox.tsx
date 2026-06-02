'use client';
import type { ComboboxRootProps } from '@base-ui/react';
import { skipToken, useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import * as React from 'react';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import type { Option } from '@/types';

export default function MultiCombobox({
  id,
  value: values,
  onValueChange,
  items = [],
  placeholder,
  emptyMessage = 'No items found.',
  loadingMessage = 'Loading...',
  onSearch,
  searchDebounceMs = 400,
  searchMinLength = 1,
  ...props
}: Omit<ComboboxRootProps<Option, true>, 'items'> & {
  id?: string;
  items?: Option[];
  placeholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  onSearch?: (query: string) => Promise<Option[]>;
  searchDebounceMs?: number;
  searchMinLength?: number;
}) {
  const anchor = useComboboxAnchor();
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, searchDebounceMs);
  const normalizedSearch = debouncedSearch.trim();
  const shouldSearch = Boolean(onSearch) && normalizedSearch.length >= searchMinLength;

  // oxlint-disable-next-line @tanstack/query/exhaustive-deps
  const { data: asyncItems, isFetching } = useQuery({
    enabled: shouldSearch,
    queryFn: shouldSearch && onSearch ? async () => await onSearch(normalizedSearch) : skipToken,
    queryKey: ['multi-combobox', id, normalizedSearch],
  });

  const mergedItems = React.useMemo(() => {
    const map = new Map<string, Option>();

    for (const option of values ?? []) {
      map.set(option.value, option);
    }

    for (const option of items) {
      map.set(option.value, option);
    }

    for (const option of asyncItems ?? []) {
      map.set(option.value, option);
    }

    return [...map.values()];
  }, [asyncItems, items, values]);

  const handleValueChange: NonNullable<ComboboxRootProps<Option, true>['onValueChange']> = (...args) => {
    setSearch('');
    onValueChange?.(...args);
  };

  return (
    <Combobox multiple autoHighlight items={mergedItems} value={values} onValueChange={handleValueChange} {...props}>
      <ComboboxChips ref={anchor} className="w-full max-w-xs">
        <ComboboxValue placeholder="">
          {(val: typeof values) => (
            <React.Fragment>
              {val?.map((option) => (
                <ComboboxChip key={option.value}>{option.label}</ComboboxChip>
              ))}
              <ComboboxChipsInput
                placeholder={values?.length ? undefined : placeholder}
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
              />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>

      <ComboboxContent anchor={anchor}>
        {isFetching ? <div className="px-2 py-1.5 text-sm text-muted-foreground">{loadingMessage}</div> : null}
        <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
        <ComboboxList>
          {(item: Option) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
