import type { InferOutput } from 'valibot';
import { TrendingMediaTypeSchema, type OptionsSchema } from '@/schemas';

export type Option = InferOutput<typeof OptionsSchema>[number];
export type TrendingMediaType = InferOutput<typeof TrendingMediaTypeSchema>;
