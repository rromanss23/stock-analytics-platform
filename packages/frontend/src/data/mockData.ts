// packages/frontend/src/data/mockData.ts
import { Stock, Crypto, Commodity } from '@/types/asset';

export const mockStocksData: Stock[] = [
  {
    id: 1,
    symbol: 'AAPL',
    name: 'Apple Inc.',
    indexWeight: '7.0%',
    currentPrice: 175.43,
    change1d: 1.35,
    change7d: 2.84,
    marketCap: '2.75T',
    sector: 'Technology',
    pe_ratio: 28.5
  },
  {
    id: 2,
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    indexWeight: '6.8%',
    currentPrice: 378.85,
    change1d: 1.52,
    change7d: -0.73,
    marketCap: '2.81T',
    sector: 'Technology',
    pe_ratio: 32.1
  },
  {
    id: 3,
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    indexWeight: '3.2%',
    currentPrice: 145.12,
    change1d: 0.68,
    change7d: 4.21,
    marketCap: '1.51T',
    sector: 'Consumer Discretionary',
    pe_ratio: 45.2
  },
  {
    id: 4,
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    indexWeight: '4.1%',
    currentPrice: 141.80,
    change1d: -0.87,
    change7d: 1.95,
    marketCap: '1.78T',
    sector: 'Technology',
    pe_ratio: 26.8
  },
  {
    id: 5,
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    indexWeight: '1.9%',
    currentPrice: 248.50,
    change1d: -3.24,
    change7d: -8.15,
    marketCap: '789.2B',
    sector: 'Consumer Discretionary',
    pe_ratio: 58.7
  },
  {
    id: 6,
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    indexWeight: '2.3%',
    currentPrice: 325.67,
    change1d: 2.18,
    change7d: 5.42,
    marketCap: '826.4B',
    sector: 'Technology',
    pe_ratio: 24.3
  },
  {
    id: 7,
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    indexWeight: '4.5%',
    currentPrice: 875.28,
    change1d: 4.73,
    change7d: 12.86,
    marketCap: '2.16T',
    sector: 'Technology',
    pe_ratio: 65.4
  }
];

export const mockCryptoData: Crypto[] = [
  {
    id: 1,
    symbol: 'BTC',
    name: 'Bitcoin',
    currentPrice: 67850.23,
    change1d: 2.45,
    change7d: -1.23,
    marketCap: '1.34T',
    rank: 1,
    circulatingSupply: '19.7M',
    maxSupply: '21M',
    volume24h: 45000000000
  },
  {
    id: 2,
    symbol: 'ETH',
    name: 'Ethereum',
    currentPrice: 3842.56,
    change1d: 3.12,
    change7d: 5.67,
    marketCap: '462B',
    rank: 2,
    circulatingSupply: '120.3M',
    maxSupply: 'N/A',
    volume24h: 18000000000
  },
  {
    id: 3,
    symbol: 'BNB',
    name: 'BNB',
    currentPrice: 635.84,
    change1d: -0.89,
    change7d: 8.34,
    marketCap: '92.1B',
    rank: 3,
    circulatingSupply: '144.9M',
    maxSupply: '200M',
    volume24h: 2100000000
  },
  {
    id: 4,
    symbol: 'SOL',
    name: 'Solana',
    currentPrice: 198.47,
    change1d: 5.67,
    change7d: 15.23,
    marketCap: '93.4B',
    rank: 4,
    circulatingSupply: '470.7M',
    maxSupply: 'N/A',
    volume24h: 4200000000
  },
  {
    id: 5,
    symbol: 'XRP',
    name: 'XRP',
    currentPrice: 0.58,
    change1d: -2.34,
    change7d: -5.12,
    marketCap: '33.1B',
    rank: 5,
    circulatingSupply: '57.1B',
    maxSupply: '100B',
    volume24h: 1800000000
  },
  {
    id: 6,
    symbol: 'ADA',
    name: 'Cardano',
    currentPrice: 0.89,
    change1d: 1.23,
    change7d: 7.89,
    marketCap: '31.2B',
    rank: 6,
    circulatingSupply: '35.0B',
    maxSupply: '45B',
    volume24h: 850000000
  },
  {
    id: 7,
    symbol: 'AVAX',
    name: 'Avalanche',
    currentPrice: 42.15,
    change1d: 4.56,
    change7d: 18.34,
    marketCap: '17.8B',
    rank: 7,
    circulatingSupply: '422.4M',
    maxSupply: '720M',
    volume24h: 650000000
  }
];

export const mockCommoditiesData: Commodity[] = [
  {
    id: 1,
    symbol: 'GC=F',
    name: 'Gold',
    currentPrice: 2034.50,
    change1d: 0.75,
    change7d: 2.34,
    unit: 'oz',
    exchange: 'COMEX',
    category: 'Precious Metals',
    contractMonth: 'Dec 2024'
  },
  {
    id: 2,
    symbol: 'SI=F',
    name: 'Silver',
    currentPrice: 24.68,
    change1d: 1.23,
    change7d: 4.56,
    unit: 'oz',
    exchange: 'COMEX',
    category: 'Precious Metals',
    contractMonth: 'Dec 2024'
  },
  {
    id: 3,
    symbol: 'CL=F',
    name: 'Crude Oil (WTI)',
    currentPrice: 78.45,
    change1d: -1.89,
    change7d: -3.21,
    unit: 'bbl',
    exchange: 'NYMEX',
    category: 'Energy',
    contractMonth: 'Jan 2025'
  },
  {
    id: 4,
    symbol: 'NG=F',
    name: 'Natural Gas',
    currentPrice: 2.87,
    change1d: 2.34,
    change7d: 8.45,
    unit: 'MMBtu',
    exchange: 'NYMEX',
    category: 'Energy',
    contractMonth: 'Dec 2024'
  },
  {
    id: 5,
    symbol: 'ZC=F',
    name: 'Corn',
    currentPrice: 4.65,
    change1d: -0.45,
    change7d: 1.23,
    unit: 'bu',
    exchange: 'CBOT',
    category: 'Agriculture',
    contractMonth: 'Mar 2025'
  },
  {
    id: 6,
    symbol: 'ZS=F',
    name: 'Soybeans',
    currentPrice: 12.34,
    change1d: 0.89,
    change7d: 3.67,
    unit: 'bu',
    exchange: 'CBOT',
    category: 'Agriculture',
    contractMonth: 'Jan 2025'
  },
  {
    id: 7,
    symbol: 'HG=F',
    name: 'Copper',
    currentPrice: 4.23,
    change1d: 1.56,
    change7d: 5.78,
    unit: 'lb',
    exchange: 'COMEX',
    category: 'Industrial Metals',
    contractMonth: 'Dec 2024'
  }
];