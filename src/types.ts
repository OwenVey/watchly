import type { InferOutput } from 'valibot';
import type {
  MovieReleaseTypeSchema,
  MovieSchema,
  OptionsSchema,
  PersonSchema,
  SeasonOutputSchema,
  SeriesSchema,
  TvShowStatusSchema,
  TvShowTypeSchema,
} from '@/schemas';

export type Movie = InferOutput<typeof MovieSchema>;
export type Series = InferOutput<typeof SeriesSchema>;
export type Person = InferOutput<typeof PersonSchema>;
export type MovieReleaseType = InferOutput<typeof MovieReleaseTypeSchema>;
export type TvShowType = InferOutput<typeof TvShowTypeSchema>;
export type TvShowStatus = InferOutput<typeof TvShowStatusSchema>;
export type Season = InferOutput<typeof SeasonOutputSchema>;
export type Option = InferOutput<typeof OptionsSchema>[number];
