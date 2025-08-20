// packages/shared/src/types/asset.ts
import { z } from 'zod';
import React from 'react';

// Base asset schema that all assets extend
export const BaseAssetSchema = z.object({
  id: z.number(),
  symbol: z.string(),
  name: z.string(),
  currentPrice: z.number().positive(),
  change1d: z.number(),
  change7d: z.number(),
  volume24h: z.number().optional(),
});

// Stock-specific schema
export const StockSchema = BaseAssetSchema.extend({
  indexWeight: z.string(), // e.g., "7.0%"
  marketCap: z.string(), // e.g., "2.75T"
  sector: z.string().optional(),
  pe_ratio: z.number().optional(),
});

// Cryptocurrency-specific schema
export const CryptoSchema = BaseAssetSchema.extend({
  marketCap: z.string(),
  circulatingSupply: z.string().optional(),
  maxSupply: z.string().optional(),
  rank: z.number().optional(),
});

// Commodity-specific schema
export const CommoditySchema = BaseAssetSchema.extend({
  unit: z.string(), // e.g., "oz", "barrel", "bushel"
  exchange: z.string(), // e.g., "COMEX", "NYMEX"
  category: z.string(), // e.g., "Precious Metals", "Energy", "Agriculture"
  contractMonth: z.string().optional(),
});

// Asset type enum
export const AssetTypeSchema = z.enum(['stock', 'crypto', 'commodity']);

// Index/Category enums
export const StockIndexSchema = z.enum(['SP500', 'NASDAQ100', 'DOW30', 'RUSSELL2000']);
export const CryptoIndexSchema = z.enum(['TOP100', 'DEFI', 'LAYER1', 'MEME']);
export const CommodityIndexSchema = z.enum(['PRECIOUS_METALS', 'ENERGY', 'AGRICULTURE', 'INDUSTRIAL_METALS']);

// Inferred types
export type BaseAsset = z.infer<typeof BaseAssetSchema>;
export type Stock = z.infer<typeof StockSchema>;
export type Crypto = z.infer<typeof CryptoSchema>;
export type Commodity = z.infer<typeof CommoditySchema>;
export type AssetType = z.infer<typeof AssetTypeSchema>;
export type StockIndex = z.infer<typeof StockIndexSchema>;
export type CryptoIndex = z.infer<typeof CryptoIndexSchema>;
export type CommodityIndex = z.infer<typeof CommodityIndexSchema>;

// Union type for all assets
export type Asset = Stock | Crypto | Commodity;

// Generic table data interface
export interface AssetTableData<T extends BaseAsset> {
  assets: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// Asset configuration interface for the generic component
export interface AssetConfig<T extends BaseAsset, I extends string> {
  assetType: AssetType;
  title: string;
  description: string;
  indexOptions: Array<{ value: I; label: string }>;
  defaultIndex: I;
  columns: Array<{
    field: keyof T | string;
    headerName: string;
    width: number;
    align?: 'left' | 'center' | 'right';
    headerAlign?: 'left' | 'center' | 'right';
    renderCell?: (params: { value: any; row: T }) => React.ReactNode;
  }>;
  formatters: {
    currency?: (value: number) => string;
    percentage?: (value: number) => { value: string; color: string; icon: React.ReactNode };
    custom?: Record<string, (value: any) => React.ReactNode>;
  };
}