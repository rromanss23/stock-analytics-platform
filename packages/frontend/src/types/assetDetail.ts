// packages/frontend/src/types/assetDetail.ts
import { z } from 'zod';
import React from 'react';

// Price point schema for OHLCV data
export const PricePointSchema = z.object({
  timestamp: z.number(),
  date: z.string(),
  open: z.number().positive(),
  high: z.number().positive(),
  low: z.number().positive(),
  close: z.number().positive(),
  volume: z.number().nonnegative(),
});

// Prediction schema for ML-based price predictions
export const PredictionSchema = z.object({
  targetDate: z.string(),
  predictedPrice: z.number().positive(),
  confidence: z.number().min(0).max(1),
  methodology: z.string(),
});

// Time period union type
export const TimePeriodSchema = z.enum(['1d', '7d', '1m', '3m', '6m', '1y']);

// Inferred types
export type PricePoint = z.infer<typeof PricePointSchema>;
export type Prediction = z.infer<typeof PredictionSchema>;
export type TimePeriod = z.infer<typeof TimePeriodSchema>;

// Chart formatting utilities
export interface ChartFormatters {
  formatCurrency: (value: number, assetType?: string) => string;
  formatPercentage: (value: number) => {
    value: string;
    color: 'success' | 'error';
    icon: React.ReactNode;
  };
}

// Asset detail page props
export interface AssetDetailPageProps {
  assetType: 'stock' | 'crypto' | 'commodity';
}