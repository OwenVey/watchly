import type { MovieReleaseTypeSchema, MovieSchema, PersonSchema, SeriesSchema, TvShowTypeSchema } from '@/schemas';
import type { z } from 'zod';

export type Movie = z.infer<typeof MovieSchema>;
export type Series = z.infer<typeof SeriesSchema>;
export type Person = z.infer<typeof PersonSchema>;
export type MovieReleaseType = z.infer<typeof MovieReleaseTypeSchema>;
export type TvShowType = z.infer<typeof TvShowTypeSchema>;
