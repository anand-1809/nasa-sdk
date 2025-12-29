import { z } from 'zod';

export interface SDKConfig {
  apiKey: string;
  retries?: number;
  retryDelayMs?: number;
}

export const ApodSchema = z.object({
  date: z.string(), // YYYY-MM-DD
  title: z.string(),
  explanation: z.string(),
  media_type: z.enum(['image', 'video']),
  url: z.string().url(),
  hdurl: z.string().url().optional(),
  service_version: z.string(),
});

export const ApodArraySchema = z.array(ApodSchema);

export type ApodResponse = z.infer<typeof ApodSchema>;
export type ApodArrayResponse = z.infer<typeof ApodArraySchema>;
