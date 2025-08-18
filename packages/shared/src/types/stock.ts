import { z } from 'zod';

export const StockSchema = z.object({
  symbol: z.string(),
  name: z.string(),
  currentPrice: z.number().positive(),
  marketCap: z.number().positive(),
  indexWeight: z.number().min(0).max(100),
  variation24h: z.number(),
  variation7d: z.number(),
  change24h: z.number(),
  change7d: z.number(),
});

export const StockIndexSchema = z.enum(['SP500', 'NASDAQ100', 'DOW30']);

export type Stock = z.infer<typeof StockSchema>;
export type StockIndex = z.infer<typeof StockIndexSchema>;

export interface StockTableData {
  stocks: Stock[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}