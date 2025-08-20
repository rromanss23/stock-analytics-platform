// packages/frontend/src/types/historicalData.ts
import { z } from 'zod';

export const PricePointSchema = z.object({
  timestamp: z.number(), // Unix timestamp
  open: z.number().positive(),
  high: z.number().positive(),
  low: z.number().positive(),
  close: z.number().positive(),
  volume: z.number().nonnegative(),
});

export const HistoricalDataSchema = z.object({
  symbol: z.string(),
  interval: z.enum(['1d', '7d', '1m', '3m', '6m', '1y', 'max']),
  data: z.array(PricePointSchema),
});

export const PredictionSchema = z.object({
  symbol: z.string(),
  targetDate: z.number(), // Unix timestamp
  predictedPrice: z.number().positive(),
  confidence: z.number().min(0).max(1),
  methodology: z.string(),
});

export type PricePoint = z.infer<typeof PricePointSchema>;
export type HistoricalData = z.infer<typeof HistoricalDataSchema>;
export type Prediction = z.infer<typeof PredictionSchema>;