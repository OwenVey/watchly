import type { MovieSchema, ReleaseTypeSchema, SeriesSchema } from '@/schemas';
import type { z } from 'zod';

export type Movie = z.infer<typeof MovieSchema>;
export type Series = z.infer<typeof SeriesSchema>;
export type ReleaseType = z.infer<typeof ReleaseTypeSchema>;
