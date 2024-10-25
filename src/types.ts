import type { MovieSchema, ReleaseTypeSchema } from '@/schemas';
import type { z } from 'zod';

export type Movie = z.infer<typeof MovieSchema>;
export type ReleaseType = z.infer<typeof ReleaseTypeSchema>;
