
import logging
import time
from datetime import datetime, timezone
from typing import Dict, List, Optional, Union, Tuple
import warnings

import pandas as pd
import yfinance as yf
from pydantic import BaseModel, Field, field_validator
import numpy as np

# Suppress yfinance warnings
warnings.filterwarnings("ignore", category=FutureWarning)

logger = logging.getLogger(__name__)


# Data Models (keep these - they provide value for validation)
class MarketDataPoint(BaseModel):
    """Validated market data point."""
    symbol: str
    timestamp: datetime
    open: float = Field(gt=0)
    high: float = Field(gt=0)
    low: float = Field(gt=0)
    close: float = Field(gt=0)
    volume: int = Field(ge=0)
    adj_close: Optional[float] = Field(default=None, gt=0)
    
    @field_validator('high', 'low', 'close')
    @classmethod
    def validate_ohlc_relationships(cls, v, info):
        """Validate OHLC price relationships."""
        if info.data:
            open_price = info.data.get('open')
            high_price = info.data.get('high')
            low_price = info.data.get('low')
            close_price = info.data.get('close')
            
            # Only validate if we have the required values
            if open_price is not None and high_price is not None and low_price is not None:
                if info.field_name == 'high' and v < max(open_price, close_price or 0):
                    raise ValueError("High must be >= max(open, close)")
                if info.field_name == 'low' and v > min(open_price, close_price or float('inf')):
                    raise ValueError("Low must be <= min(open, close)")
        return v


class AssetInfo(BaseModel):
    """Asset information and metadata."""
    symbol: str
    name: Optional[str] = None
    sector: Optional[str] = None
    market_cap: Optional[float] = None
    currency: Optional[str] = None
    exchange: Optional[str] = None
    asset_type: str = Field(default="stock")


# Configuration
DEFAULT_CONFIG = {
    'max_retries': 3,
    'retry_delay': 1.0,
    'timeout': 30,
    'validate_data': True
}


def fetch_historical_data(
    symbols: Union[str, List[str]],
    period: str = "1y",
    interval: str = "1d",
    start: Optional[str] = None,
    end: Optional[str] = None,
    config: Optional[Dict] = None
) -> Dict[str, pd.DataFrame]:
    """
    Fetch historical data for symbols.
    
    Args:
        symbols: Single symbol or list of symbols
        period: Data period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
        interval: Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)
        start: Start date (YYYY-MM-DD)
        end: End date (YYYY-MM-DD)
        config: Configuration overrides
        
    Returns:
        Dictionary mapping symbols to DataFrames with historical data
    """
    cfg = {**DEFAULT_CONFIG, **(config or {})}
    
    if isinstance(symbols, str):
        symbols = [symbols]
    
    results = {}
    
    for symbol in symbols:
        try:
            logger.info(f"Fetching historical data for {symbol}")
            data = _fetch_single_symbol_with_retry(symbol, period, interval, start, end, cfg)
            
            if data is not None and not data.empty:
                if cfg['validate_data']:
                    data = validate_and_clean_data(data, symbol)
                
                if not data.empty:
                    results[symbol] = data
                    logger.info(f"Successfully fetched {len(data)} records for {symbol}")
                else:
                    logger.warning(f"No valid data after cleaning for {symbol}")
            else:
                logger.warning(f"No data returned for {symbol}")
                
        except Exception as e:
            logger.error(f"Failed to fetch data for {symbol}: {str(e)}")
            continue
            
    return results


def _fetch_single_symbol_with_retry(
    symbol: str,
    period: str,
    interval: str,
    start: Optional[str],
    end: Optional[str],
    config: Dict
) -> Optional[pd.DataFrame]:
    """Fetch data for a single symbol with retry logic."""
    
    for attempt in range(config['max_retries']):
        try:
            ticker = yf.Ticker(symbol)
            
            # Fetch historical data
            kwargs = {
                'interval': interval,
                'actions': True,
                'timeout': config['timeout']
            }
            
            if start and end:
                hist = ticker.history(start=start, end=end, **kwargs)
            else:
                hist = ticker.history(period=period, **kwargs)
            
            if hist.empty:
                logger.warning(f"Empty dataset returned for {symbol}")
                return None
            
            # Prepare DataFrame
            hist['symbol'] = symbol
            hist = hist.reset_index()
            
            # Standardize column names
            column_mapping = {
                'Date': 'timestamp',
                'Datetime': 'timestamp',
                'Open': 'open',
                'High': 'high',
                'Low': 'low',
                'Close': 'close',
                'Adj Close': 'adj_close',
                'Volume': 'volume',
                'Dividends': 'dividends',
                'Stock Splits': 'stock_splits'
            }
            
            hist = hist.rename(columns=column_mapping)
            
            # Ensure required columns exist
            required_columns = ['timestamp', 'open', 'high', 'low', 'close', 'volume']
            missing_columns = [col for col in required_columns if col not in hist.columns]
            if missing_columns:
                logger.error(f"Missing required columns for {symbol}: {missing_columns}")
                return None
            
            # Add missing optional columns with defaults
            if 'adj_close' not in hist.columns:
                hist['adj_close'] = hist['close']
            if 'dividends' not in hist.columns:
                hist['dividends'] = 0.0
            if 'stock_splits' not in hist.columns:
                hist['stock_splits'] = 0.0
            
            return hist
            
        except Exception as e:
            logger.warning(f"Attempt {attempt + 1} failed for {symbol}: {str(e)}")
            if attempt < config['max_retries'] - 1:
                time.sleep(config['retry_delay'] * (2 ** attempt))  # Exponential backoff
            else:
                logger.error(f"All retry attempts failed for {symbol}")
                return None


def validate_and_clean_data(data: pd.DataFrame, symbol: str) -> pd.DataFrame:
    """
    Validate and clean financial data.
    
    Args:
        data: Raw DataFrame from yfinance
        symbol: Symbol for logging
        
    Returns:
        Cleaned DataFrame
    """
    logger.info(f"Validating data for {symbol}")
    original_count = len(data)
    
    # Remove rows with NaN values in critical columns
    critical_columns = ['open', 'high', 'low', 'close', 'volume']
    data = data.dropna(subset=critical_columns)
    
    # Remove rows with zero or negative prices
    price_columns = ['open', 'high', 'low', 'close', 'adj_close']
    for col in price_columns:
        if col in data.columns:
            data = data[data[col] > 0]
    
    # Remove rows with negative volume
    data = data[data['volume'] >= 0]
    
    # Validate OHLC relationships
    valid_ohlc = (
        (data['high'] >= data['low']) &
        (data['high'] >= data['open']) &
        (data['high'] >= data['close']) &
        (data['low'] <= data['open']) &
        (data['low'] <= data['close'])
    )
    data = data[valid_ohlc]
    
    # Detect anomalies
    data = detect_and_flag_anomalies(data, symbol)
    
    # Sort by timestamp
    data = data.sort_values('timestamp').reset_index(drop=True)
    
    cleaned_count = len(data)
    if cleaned_count < original_count:
        logger.info(f"Cleaned {symbol}: {original_count} -> {cleaned_count} records")
    
    return data


def detect_and_flag_anomalies(data: pd.DataFrame, symbol: str) -> pd.DataFrame:
    """
    Detect price anomalies using statistical methods.
    
    Args:
        data: DataFrame with price data
        symbol: Symbol for logging
        
    Returns:
        DataFrame with anomaly flags
    """
    if len(data) < 10:  # Need sufficient data
        data['is_anomaly'] = False
        return data
    
    # Calculate price change percentages
    price_change = data['close'].pct_change()
    
    # Detect extreme movements (beyond 3 standard deviations)
    change_std = price_change.std()
    change_mean = price_change.mean()
    
    anomaly_threshold = 3 * change_std
    anomalies = abs(price_change - change_mean) > anomaly_threshold
    
    if anomalies.any():
        anomaly_count = anomalies.sum()
        logger.warning(f"Detected {anomaly_count} potential anomalies in {symbol}")
    
    data['is_anomaly'] = anomalies
    return data


def fetch_asset_info(symbols: Union[str, List[str]]) -> Dict[str, AssetInfo]:
    """
    Fetch asset information and metadata.
    
    Args:
        symbols: Single symbol or list of symbols
        
    Returns:
        Dictionary mapping symbols to AssetInfo objects
    """
    if isinstance(symbols, str):
        symbols = [symbols]
    
    results = {}
    
    for symbol in symbols:
        try:
            logger.info(f"Fetching asset info for {symbol}")
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            asset_info = AssetInfo(
                symbol=symbol,
                name=info.get('longName') or info.get('shortName'),
                sector=info.get('sector'),
                market_cap=info.get('marketCap'),
                currency=info.get('currency'),
                exchange=info.get('exchange'),
                asset_type=determine_asset_type(symbol, info)
            )
            
            results[symbol] = asset_info
            logger.info(f"Successfully fetched info for {symbol}")
            
        except Exception as e:
            logger.error(f"Failed to fetch info for {symbol}: {str(e)}")
            # Create minimal asset info
            results[symbol] = AssetInfo(
                symbol=symbol,
                asset_type=determine_asset_type(symbol, {})
            )
    
    return results


def determine_asset_type(symbol: str, info: Dict) -> str:
    """Determine asset type based on symbol and info."""
    # Cryptocurrency patterns
    crypto_suffixes = ['-USD', '-USDT', '-BTC', '-ETH']
    crypto_symbols = ['BTC-USD', 'ETH-USD', 'ADA-USD', 'DOT-USD']
    
    if any(symbol.endswith(suffix) for suffix in crypto_suffixes) or symbol in crypto_symbols:
        return 'crypto'
    
    # Commodity futures (usually end with =F)
    if symbol.endswith('=F'):
        return 'commodity'
    
    # ETF patterns
    if info.get('quoteType') == 'ETF':
        return 'etf'
    
    return 'stock'


def validate_symbols(symbols: List[str]) -> Tuple[List[str], List[str]]:
    """
    Validate a list of symbols.
    
    Args:
        symbols: List of symbols to validate
        
    Returns:
        Tuple of (valid_symbols, invalid_symbols)
    """
    valid_symbols = []
    invalid_symbols = []
    
    for symbol in symbols:
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            if info and info.get('regularMarketPrice') is not None:
                valid_symbols.append(symbol)
            else:
                invalid_symbols.append(symbol)
                
        except Exception:
            invalid_symbols.append(symbol)
            
    return valid_symbols, invalid_symbols


def get_market_status(symbol: str) -> Dict:
    """
    Get market status for a symbol.
    
    Args:
        symbol: Stock symbol
        
    Returns:
        Dictionary with market status information
    """
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        return {
            'is_open': info.get('marketState', 'CLOSED') == 'REGULAR',
            'exchange': info.get('exchange', 'Unknown'),
            'currency': info.get('currency', 'USD'),
            'last_updated': datetime.now(timezone.utc),
        }
        
    except Exception as e:
        logger.error(f"Failed to get market status for {symbol}: {str(e)}")
        return {
            'is_open': False,
            'exchange': 'Unknown',
            'currency': 'USD',
            'last_updated': datetime.now(timezone.utc),
        }


# Pipeline Composition Functions
def fetch_and_validate_data(
    symbols: Union[str, List[str]],
    period: str = "1y",
    interval: str = "1d"
) -> Dict[str, pd.DataFrame]:
    """
    Complete pipeline: fetch + validate symbols, then fetch data.
    
    This is the main function for CLI usage.
    """
    if isinstance(symbols, str):
        symbols = [symbols]
    
    # Validate symbols first
    valid_symbols, invalid_symbols = validate_symbols(symbols)
    
    if invalid_symbols:
        logger.warning(f"Invalid symbols (skipping): {invalid_symbols}")
    
    if not valid_symbols:
        logger.error("No valid symbols provided")
        return {}
    
    # Fetch historical data
    historical_data = fetch_historical_data(
        symbols=valid_symbols,
        period=period,
        interval=interval
    )
    
    return historical_data


def main():
    """Example usage for CLI integration."""
    logging.basicConfig(level=logging.INFO)
    
    # Example symbols
    symbols = ['AAPL']
    #symbols = ['AAPL', 'MSFT', 'GOOGL', 'BTC-USD', 'GC=F']
    
    # Fetch data using the pipeline function
    data = fetch_and_validate_data(symbols, period="5d", interval="1d")
    
    # Fetch asset info
    asset_info = fetch_asset_info(list(data.keys()))
    
    # Display results
    for symbol in data:
        df = data[symbol]
        info = asset_info[symbol]
        print(f"\n{symbol} ({info.name}):")
        print(f"  Asset Type: {info.asset_type}")
        print(f"  Records: {len(df)}")
        print(f"  Date Range: {df['timestamp'].min()} to {df['timestamp'].max()}")
        print(f"  Latest Close: ${df['close'].iloc[-1]:.2f}")


if __name__ == "__main__":
    main()