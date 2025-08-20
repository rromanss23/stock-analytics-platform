// packages/frontend/src/utils/chartUtils.tsx
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { Typography, Paper } from '@mui/material';

/**
 * Formats currency values with appropriate precision
 */
export function formatCurrency(value: number, assetType?: string): string {
  // Special handling for crypto with very small values
  if (assetType === 'crypto' && value < 1) {
    return `$${value.toFixed(6)}`;
  }
  
  // Use dynamic precision based on value
  const precision = value < 10 ? 4 : 2;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: precision,
  }).format(value);
}

/**
 * Formats percentage values with color and icon indicators
 */
export function formatPercentage(value: number) {
  const isPositive = value >= 0;
  const color = isPositive ? 'success' : 'error';
  const icon = isPositive ? <TrendingUp /> : <TrendingDown />;
  
  return {
    value: `${isPositive ? '+' : ''}${value.toFixed(2)}%`,
    color: color as 'success' | 'error',
    icon,
  };
}

/**
 * Custom tooltip component for Recharts
 */
export function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Paper sx={{ p: 2, maxWidth: 250, bgcolor: 'background.paper', boxShadow: 3 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          {data.date}
        </Typography>
        <Typography variant="body2">
          Open: {formatCurrency(data.open)}
        </Typography>
        <Typography variant="body2">
          High: {formatCurrency(data.high)}
        </Typography>
        <Typography variant="body2">
          Low: {formatCurrency(data.low)}
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          Close: {formatCurrency(data.close)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Volume: {data.volume.toLocaleString()}
        </Typography>
      </Paper>
    );
  }
  return null;
}

/**
 * Calculates dynamic Y-axis domain with padding for Recharts
 */
export function calculateYAxisDomain(
  data: any[], 
  dataKey: string = 'close', 
  paddingPercent: number = 0.5
): [((dataMin: number) => number), ((dataMax: number) => number)] {
  if (!data || data.length === 0) {
    return [
      (dataMin: number) => dataMin * 0.995,
      (dataMax: number) => dataMax * 1.005
    ];
  }
  
  const values = data.map(item => item[dataKey]).filter(val => typeof val === 'number');
  if (values.length === 0) {
    return [
      (dataMin: number) => dataMin * 0.995,
      (dataMax: number) => dataMax * 1.005
    ];
  }
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const padding = range * (paddingPercent / 100);
  
  return [
    (dataMin: number) => Math.max(0, dataMin - padding),
    (dataMax: number) => dataMax + padding
  ];
}

/**
 * Formats large numbers for chart axis labels
 */
export function formatAxisNumber(value: number): string {
  if (Math.abs(value) >= 1e9) {
    return `${(value / 1e9).toFixed(1)}B`;
  }
  if (Math.abs(value) >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }
  return value.toFixed(2);
}

/**
 * Gets chart theme colors based on trend
 */
export function getChartColors(trend: 'positive' | 'negative' | 'neutral' = 'neutral') {
  const colors = {
    positive: {
      primary: '#2e7d32',   // Green
      secondary: '#4caf50',
      background: '#e8f5e8'
    },
    negative: {
      primary: '#d32f2f',   // Red
      secondary: '#f44336',
      background: '#ffebee'
    },
    neutral: {
      primary: '#1976d2',   // Blue
      secondary: '#2196f3',
      background: '#e3f2fd'
    }
  };
  
  return colors[trend];
}

/**
 * Chart configuration presets for different asset types
 */
export const CHART_CONFIGS = {
  stock: {
    strokeWidth: 2,
    activeDotRadius: 6,
    gridStrokeDasharray: '3 3',
    referenceLineStroke: '#ff9800',
    referenceLineStrokeDasharray: '5 5',
  },
  crypto: {
    strokeWidth: 2.5,
    activeDotRadius: 8,
    gridStrokeDasharray: '2 2',
    referenceLineStroke: '#ff6b35',
    referenceLineStrokeDasharray: '4 4',
  },
  commodity: {
    strokeWidth: 2,
    activeDotRadius: 6,
    gridStrokeDasharray: '4 4',
    referenceLineStroke: '#8bc34a',
    referenceLineStrokeDasharray: '6 6',
  },
} as const;

/**
 * Time period display labels
 */
export const TIME_PERIOD_LABELS = {
  '1d': '1D',
  '7d': '1W',
  '1m': '1M',
  '3m': '3M',
  '6m': '6M',
  '1y': '1Y',
} as const;

/**
 * Calculates price change between two values
 */
export function calculatePriceChange(currentPrice: number, previousPrice: number) {
  const change = currentPrice - previousPrice;
  const changePercent = (change / previousPrice) * 100;
  
  return {
    absolute: change,
    percent: changePercent,
    formatted: formatPercentage(changePercent),
  };
}

/**
 * Determines if market hours are active (simplified)
 */
export function isMarketHours(assetType: string): boolean {
  if (assetType === 'crypto') return true; // Crypto trades 24/7
  
  const now = new Date();
  const day = now.getUTCDay();
  const hour = now.getUTCHours();
  
  // Weekend check
  if (day === 0 || day === 6) return false;
  
  // Simplified trading hours (9:30 AM - 4:00 PM EST = 14:30 - 21:00 UTC)
  return hour >= 14 && hour < 21;
}

/**
 * Formats volume numbers for display
 */
export function formatVolume(volume: number): string {
  if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
  return volume.toFixed(0);
}