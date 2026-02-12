import type { z } from 'zod';
import type {
  MovieReleaseTypeSchema,
  MovieSchema,
  PersonSchema,
  SeasonOutputSchema,
  SeriesSchema,
  TvShowStatusSchema,
  TvShowTypeSchema,
} from '@/schemas';

export type Movie = z.infer<typeof MovieSchema>;
export type Series = z.infer<typeof SeriesSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type MovieReleaseType = z.infer<typeof MovieReleaseTypeSchema>;
export type TvShowType = z.infer<typeof TvShowTypeSchema>;
export type TvShowStatus = z.infer<typeof TvShowStatusSchema>;
export type Season = z.infer<typeof SeasonOutputSchema>;
