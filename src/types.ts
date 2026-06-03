import type { InferOutput } from 'valibot';
import { TrendingMediaTypeSchema, type MovieReleaseTypeSchema, type OptionsSchema } from '@/schemas';

export type MovieReleaseType = InferOutput<typeof MovieReleaseTypeSchema>;
export type Option = InferOutput<typeof OptionsSchema>[number];
export type TrendingMediaType = InferOutput<typeof TrendingMediaTypeSchema>;
