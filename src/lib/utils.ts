import * as v from 'valibot';

export { cn } from 'cn';

export function formatMinutesToHHMM(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  const hoursPart = hours > 0 ? `${hours}h` : '';
  const minutesPart = `${remainingMinutes}m`;

  // Join the parts with a space if hoursPart is present
  return [hoursPart, minutesPart].filter((part) => part !== '').join(' ');
}

export function toggleItemInArray<T extends string | number>(array: T[], item: T) {
  if (array.includes(item)) {
    return array.filter((i) => i !== item);
  }
  return [...array, item];
}

/**
 * Formats a number as a currency string based on the specified locale and currency.
 *
 * @param {number} amount - The amount of money to format.
 * @param {string} - The locale string (e.g., 'en-US', 'de-DE'). Default is `'en-US'`
 */
export function formatCurrency(
  amount: number,
  locale: string = 'en-US',
  currency: string = 'USD',
  options: Intl.NumberFormatOptions = {},
) {
  try {
    // Merge default and custom options
    const formatOptions: Intl.NumberFormatOptions = {
      currency,
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      style: 'currency',
      ...options,
    };

    // Create a new Intl.NumberFormat instance
    const formatter = new Intl.NumberFormat(locale, formatOptions);

    // Format the amount
    return formatter.format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return amount.toString(); // Fallback to a simple string representation
  }
}

export function schemaObjectKeys<T extends Record<string, unknown>>(obj: T) {
  const keys = Object.keys(obj) as Extract<keyof T, string>[];
  return v.picklist(keys as [Extract<keyof T, string>, ...Extract<keyof T, string>[]]);
}

export function voteAverageToPercentage(voteAverage: number) {
  return `${Math.round(voteAverage * 10)}%`;
}
