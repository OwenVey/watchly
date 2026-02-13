'use client';
import { type ComboboxRootProps } from '@base-ui/react';
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

type Option = {
  label: string;
  value: string;
};

export default function MultiCombobox({
  value: values,
  items,
  placeholder,
  ...props
}: Omit<ComboboxRootProps<Option, true>, 'items'> & {
  items: Option[];
  placeholder?: string;
}) {
  const anchor = useComboboxAnchor();

  return (
    <Combobox
      multiple
      autoHighlight
      items={items}
      // value={values?.filter(({ value }) => items.some((item) => item.value === value))}
      // onValueChange={(options) =>
      //   navigate({ to: '/movies', search: (prev) => ({ ...prev, genres: options.map(({ value }) => +value) }) })
      // }
      {...props}
    >
      <ComboboxChips ref={anchor} className="w-full max-w-xs">
        <ComboboxValue placeholder="">
          {(val: typeof values) => (
            <React.Fragment>
              {val?.map((option) => (
                <ComboboxChip key={option.value}>{option.label}</ComboboxChip>
              ))}
              <ComboboxChipsInput placeholder={values?.length ? undefined : placeholder} />
            </React.Fragment>
          )}
        </ComboboxValue>
      </ComboboxChips>

      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item: (typeof items)[number]) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
