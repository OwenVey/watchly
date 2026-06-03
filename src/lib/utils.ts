import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as v from 'valibot';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ImageTypeToSizeMap {
  backdrop: 'w300' | 'w780' | 'w1280' | 'w1440_and_h320_multi_faces' | 'original';
  logo: 'w45' | 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'original';
  poster: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
  profile: 'w45' | 'w185' | 'h632' | 'original';
  still: 'w92' | 'w185' | 'w300' | 'original';
}

/**
 * Constructs a TMDB image URL.
 *
 * @param _type - The type of the image (e.g., 'backdrop', 'logo').
 * @param path - The path of the image.
 * @param size - The size of the image, specific to the type.
 * @returns The complete URL for the TMDB image.
 */
export function getTmdbImage<T extends keyof ImageTypeToSizeMap>(
  _type: T,
  path: string,
  size: ImageTypeToSizeMap[T],
): string {
  if (!path) {
    throw new Error('Image path cannot be empty.');
  }

  return `https://image.tmdb.org/t/p/${size}/${path}`;
}

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
