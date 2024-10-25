import type { MovieSchema } from '@/schemas';
import type { z } from 'zod';

export type Movie = z.infer<typeof MovieSchema>;
