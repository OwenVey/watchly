import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ImageTypeToSizeMap = {
  backdrop: 'w300' | 'w780' | 'w1280' | 'original';
  logo: 'w45' | 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'original';
  poster: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
  profile: 'w45' | 'w185' | 'h632' | 'original';
  still: 'w92' | 'w185' | 'w300' | 'original';
};

/**
 * Constructs a TMDB image URL.
 * @param type - The type of the image (e.g., 'backdrop', 'logo').
 * @param path - The path of the image.
 * @param size - The size of the image, specific to the type.
 * @returns The complete URL for the TMDB image.
 */
export function getTmdbImage<T extends keyof ImageTypeToSizeMap>(
  type: T,
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
