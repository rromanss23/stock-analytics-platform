// packages/frontend/src/services/mockDataGenerators.ts
import { PricePoint, Prediction, TimePeriod } from '@/types/assetDetail';

/**
 * Financial data volatility patterns by asset type
 */
const VOLATILITY_PROFILES = {
  crypto: 0.06,      // 6% daily volatility for crypto
  commodity: 0.03,   // 3% daily volatility for commodities
  stock: 0.02,       // 2% daily volatility for stocks
  'high-beta': 0.04, // 4% for high-beta stocks (TSLA, NVDA, etc.)
} as const;

/**
 * Time interval configurations for different periods
 */
const TIME_INTERVALS = {
  '1d': { count: 24, step: 60 * 60 * 1000, format: 'HH:mm' },
  '7d': { count: 168, step: 60 * 60 * 1000, format: 'MM/dd HH:mm' },
  '1m': { count: 30, step: 24 * 60 * 60 * 1000, format: 'MM/dd' },
  '3m': { count: 90, step: 24 * 60 * 60 * 1000, format: 'MM/dd' },
  '6m': { count: 180, step: 24 * 60 * 60 * 1000, format: 'MM/dd' },
  '1y': { count: 365, step: 24 * 60 * 60 * 1000, format: 'MM/dd/yy' },
} as const;

/**
 * Prediction methodologies by timeframe
 */
const PREDICTION_METHODOLOGIES = {
  '1 Day': ['LSTM Neural Network', 'Technical Analysis', 'High-Frequency Pattern Recognition'],
  '1 Week': ['Ensemble Models', 'Technical + Fundamental', 'Random Forest Regression'],
  '1 Month': ['ARIMA-GARCH', 'Multi-factor Models', 'Sentiment Analysis Integration'],
  '3 Months': ['Long-term Trend Analysis', 'Economic Factor Models', 'Sector Rotation Models'],
} as const;

/**
 * Determines volatility based on asset symbol and type
 */
function getAssetVolatility(symbol: string, assetType?: string): number {
  // High-beta stocks
  if (['TSLA', 'NVDA', 'META', 'AMZN'].includes(symbol)) {
    return VOLATILITY_PROFILES['high-beta'];
  }
  
  // Crypto assets
  if (symbol.includes('BTC') || symbol.includes('ETH') || assetType === 'crypto') {
    return VOLATILITY_PROFILES.crypto;
  }
  
  // Commodity futures (usually end with =F)
  if (symbol.includes('=F') || assetType === 'commodity') {
    return VOLATILITY_PROFILES.commodity;
  }
  
  // Default to stock volatility
  return VOLATILITY_PROFILES.stock;
}

/**
 * Formats date according to the specified format
 */
function formatDate(timestamp: number, format: string): string {
  const date = new Date(timestamp);
  
  switch (format) {
    case 'HH:mm':
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
    case 'MM/dd HH:mm':
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`;
    case 'MM/dd':
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
    case 'MM/dd/yy':
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
    default:
      return date.toLocaleDateString();
  }
}

/**
 * Generates realistic historical price data with proper financial patterns
 */
export function generateMockHistoricalData(
  symbol: string,
  currentPrice: number,
  period: TimePeriod,
  assetType?: string
): PricePoint[] {
  const now = Date.now();
  const config = TIME_INTERVALS[period];
  const data: PricePoint[] = [];
  
  // Get asset-specific volatility
  const baseVolatility = getAssetVolatility(symbol, assetType);
  
  // Initialize with starting price that creates realistic trend
  const trendDirection = Math.random() > 0.5 ? 1 : -1;
  const trendStrength = 0.05 + Math.random() * 0.15; // 5-20% total trend
  let basePrice = currentPrice * (1 - (trendDirection * trendStrength));
  
  // Add market regime changes (bull/bear cycles)
  const regimeChanges = Math.max(1, Math.floor(config.count / 30));
  const regimes: number[] = [];
  for (let i = 0; i < regimeChanges; i++) {
    regimes.push(Math.floor((config.count / regimeChanges) * i));
  }
  
  let currentRegime = Math.random() > 0.5 ? 1 : -1;
  let regimeIndex = 0;
  
  // Generate price data with realistic patterns
  for (let i = config.count; i >= 0; i--) {
    const timestamp = now - (i * config.step);
    
    // Check for regime change
    if (regimeIndex < regimes.length && (config.count - i) >= regimes[regimeIndex]) {
      currentRegime *= -1;
      regimeIndex++;
    }
    
    // Calculate volatility adjustments
    const timeVolatility = period === '1d' ? baseVolatility * 0.3 : baseVolatility;
    const regimeBias = currentRegime * 0.0005; // Small directional bias
    const meanReversion = (currentPrice - basePrice) * 0.0001; // Weak mean reversion
    const randomWalk = (Math.random() - 0.5) * timeVolatility;
    
    // Apply price change
    const priceChange = (regimeBias + randomWalk + meanReversion) * basePrice;
    basePrice = Math.max(basePrice + priceChange, basePrice * 0.1); // Prevent negative prices
    
    // Generate realistic OHLC data
    const intradayVolatility = 0.003 + Math.random() * 0.012; // 0.3-1.5% intraday range
    const open = basePrice * (1 + (Math.random() - 0.5) * intradayVolatility);
    const close = basePrice * (1 + (Math.random() - 0.5) * intradayVolatility);
    const high = Math.max(open, close) * (1 + Math.random() * intradayVolatility * 0.5);
    const low = Math.min(open, close) * (1 - Math.random() * intradayVolatility * 0.5);
    
    // Generate realistic volume (higher on price movements)
    const baseVolume = 500000;
    const volumeMultiplier = 0.5 + Math.random() * 2;
    const volatilityBoost = Math.abs(priceChange / basePrice) * 10;
    const volume = Math.floor(baseVolume * volumeMultiplier * (1 + volatilityBoost));

    data.push({
      timestamp,
      date: formatDate(timestamp, config.format),
      open: Number(open.toFixed(currentPrice < 1 ? 6 : 2)),
      high: Number(high.toFixed(currentPrice < 1 ? 6 : 2)),
      low: Number(low.toFixed(currentPrice < 1 ? 6 : 2)),
      close: Number(close.toFixed(currentPrice < 1 ? 6 : 2)),
      volume,
    });
    
    basePrice = close;
  }
  
  // Ensure final price matches current price
  if (data.length > 0) {
    const lastPoint = data[data.length - 1];
    const adjustment = currentPrice / lastPoint.close;
    
    // Adjust last few points to converge to current price
    const pointsToAdjust = Math.min(5, data.length);
    for (let i = data.length - pointsToAdjust; i < data.length; i++) {
      const weight = (i - (data.length - pointsToAdjust)) / pointsToAdjust;
      const currentAdjustment = 1 + (adjustment - 1) * weight;
      
      data[i].open *= currentAdjustment;
      data[i].high *= currentAdjustment;
      data[i].low *= currentAdjustment;
      data[i].close *= currentAdjustment;
    }
    
    // Set exact current price for last point
    data[data.length - 1].close = currentPrice;
  }
  
  return data;
}

/**
 * Generates realistic price predictions with confidence intervals
 */
export function generateMockPredictions(
  symbol: string,
  currentPrice: number,
  assetType?: string
): Prediction[] {
  const baseVolatility = getAssetVolatility(symbol, assetType);
  
  const timeframes = [
    { target: '1 Day', days: 1, baseConfidence: 0.8 },
    { target: '1 Week', days: 7, baseConfidence: 0.7 },
    { target: '1 Month', days: 30, baseConfidence: 0.6 },
    { target: '3 Months', days: 90, baseConfidence: 0.45 },
  ];

  return timeframes.map(({ target, days, baseConfidence }) => {
    // Calculate prediction with time decay and uncertainty
    const timeDecay = Math.sqrt(days / 30);
    const volatilityImpact = baseVolatility * timeDecay;
    
    // Add trend bias based on symbol characteristics
    const symbolHash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const trendBias = Math.sin(symbolHash / 100) * 0.02; // -2% to +2% bias
    
    // Generate prediction with realistic uncertainty
    const uncertaintyRange = volatilityImpact * 2;
    const priceMultiplier = 1 + trendBias + (Math.random() - 0.5) * uncertaintyRange;
    const predictedPrice = currentPrice * priceMultiplier;
    
    // Adjust confidence based on volatility and timeframe
    const volatilityPenalty = (baseVolatility - 0.02) * 2; // Penalty for high volatility
    const timePenalty = (days / 365) * 0.4; // Penalty for longer timeframes
    const adjustedConfidence = Math.max(0.15, baseConfidence - volatilityPenalty - timePenalty);
    
    // Select appropriate methodology
    const methodologies = PREDICTION_METHODOLOGIES[target as keyof typeof PREDICTION_METHODOLOGIES];
    const methodology = methodologies[Math.floor(Math.random() * methodologies.length)];
    
    return {
      targetDate: target,
      predictedPrice: Number(predictedPrice.toFixed(currentPrice < 1 ? 6 : 2)),
      confidence: Number(adjustedConfidence.toFixed(2)),
      methodology,
    };
  });
}

/**
 * Simulates real-time price updates for WebSocket-like functionality
 */
export function generateRealTimePriceUpdate(
  symbol: string,
  currentPrice: number,
  assetType?: string
): {
  symbol: string;
  price: number;
  timestamp: number;
  volume: number;
  change: number;
  changePercent: number;
} {
  const volatility = getAssetVolatility(symbol, assetType);
  
  // Generate realistic real-time price change
  const priceChange = (Math.random() - 0.5) * volatility * currentPrice * 0.1; // Small real-time moves
  const newPrice = Math.max(currentPrice + priceChange, currentPrice * 0.01);
  
  return {
    symbol,
    price: Number(newPrice.toFixed(currentPrice < 1 ? 6 : 2)),
    timestamp: Date.now(),
    volume: Math.floor(Math.random() * 100000 + 10000),
    change: priceChange,
    changePercent: (priceChange / currentPrice) * 100,
  };
}

/**
 * Validates generated data for financial accuracy
 */
export function validateFinancialData(data: PricePoint[]): boolean {
  if (!data || data.length === 0) return false;
  
  for (const point of data) {
    // Basic OHLC validation
    if (point.high < Math.max(point.open, point.close)) return false;
    if (point.low > Math.min(point.open, point.close)) return false;
    if (point.open <= 0 || point.high <= 0 || point.low <= 0 || point.close <= 0) return false;
    if (point.volume < 0) return false;
  }
  
  return true;
}