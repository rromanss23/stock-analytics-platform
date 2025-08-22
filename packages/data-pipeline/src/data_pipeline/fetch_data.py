"""
Financial data fetching functions using yfinance.

Simple, composable functions for fetching and validating financial data.
Designed for CLI usage and data pipeline integration.
"""

import logging
import time
from datetime import datetime, timezone
from typing import Dict, List, Optional, Union, Tuple
import warnings

import polars as pl
import yfinance as yf
from pydantic import BaseModel, Field, field_validator
from pathlib import Path

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
    'validate_data': True,
    'output_dir': 'data/raw',  # Directory to save parquet files
    'save_to_parquet': True
}


def fetch_historical_data(
    symbols: Union[str, List[str]],
    period: str = "1y",
    interval: str = "1d",
    start: Optional[str] = None,
    end: Optional[str] = None,
    config: Optional[Dict] = None
) -> Dict[str, pl.DataFrame]:
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
            
            if data is not None and not data.is_empty():
                if cfg['validate_data']:
                    data = validate_and_clean_data(data, symbol)
                
                if not data.is_empty():
                    # Save to parquet files by year if enabled
                    if cfg['save_to_parquet']:
                        save_data_to_parquet(data, symbol, cfg['output_dir'])
                    
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
) -> Optional[pl.DataFrame]:
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
            
            # Convert to Polars DataFrame
            hist['symbol'] = symbol
            hist = hist.reset_index()
            
            # Convert pandas to polars
            polars_df = pl.from_pandas(hist)
            
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
            
            # Rename columns in Polars
            for old_name, new_name in column_mapping.items():
                if old_name in polars_df.columns:
                    polars_df = polars_df.rename({old_name: new_name})
            
            # Ensure required columns exist
            required_columns = ['timestamp', 'open', 'high', 'low', 'close', 'volume']
            missing_columns = [col for col in required_columns if col not in polars_df.columns]
            if missing_columns:
                logger.error(f"Missing required columns for {symbol}: {missing_columns}")
                return None
            
            # Add missing optional columns with defaults
            if 'adj_close' not in polars_df.columns:
                polars_df = polars_df.with_columns(pl.col('close').alias('adj_close'))
            if 'dividends' not in polars_df.columns:
                polars_df = polars_df.with_columns(pl.lit(0.0).alias('dividends'))
            if 'stock_splits' not in polars_df.columns:
                polars_df = polars_df.with_columns(pl.lit(0.0).alias('stock_splits'))
            
            return polars_df
            
        except Exception as e:
            logger.warning(f"Attempt {attempt + 1} failed for {symbol}: {str(e)}")
            if attempt < config['max_retries'] - 1:
                time.sleep(config['retry_delay'] * (2 ** attempt))  # Exponential backoff
            else:
                logger.error(f"All retry attempts failed for {symbol}")
                return None


def validate_and_clean_data(data: pl.DataFrame, symbol: str) -> pl.DataFrame:
    """
    Validate and clean financial data using Polars.
    
    Args:
        data: Raw Polars DataFrame from yfinance conversion
        symbol: Symbol for logging
        
    Returns:
        Cleaned Polars DataFrame
    """
    logger.info(f"Validating data for {symbol}")
    original_count = len(data)
    
    # Remove rows with null values in critical columns
    critical_columns = ['open', 'high', 'low', 'close', 'volume']
    data = data.drop_nulls(subset=critical_columns)
    
    # Remove rows with zero or negative prices
    price_columns = ['open', 'high', 'low', 'close', 'adj_close']
    for col in price_columns:
        if col in data.columns:
            data = data.filter(pl.col(col) > 0)
    
    # Remove rows with negative volume
    data = data.filter(pl.col('volume') >= 0)
    
    # Validate OHLC relationships using Polars expressions
    data = data.filter(
        (pl.col('high') >= pl.col('low')) &
        (pl.col('high') >= pl.col('open')) &
        (pl.col('high') >= pl.col('close')) &
        (pl.col('low') <= pl.col('open')) &
        (pl.col('low') <= pl.col('close'))
    )
    
    # Detect anomalies
    data = detect_and_flag_anomalies(data, symbol)
    
    # Sort by timestamp
    data = data.sort('timestamp')
    
    cleaned_count = len(data)
    if cleaned_count < original_count:
        logger.info(f"Cleaned {symbol}: {original_count} -> {cleaned_count} records")
    
    return data


def detect_and_flag_anomalies(data: pl.DataFrame, symbol: str) -> pl.DataFrame:
    """
    Detect price anomalies using statistical methods with Polars.
    
    Args:
        data: Polars DataFrame with price data
        symbol: Symbol for logging
        
    Returns:
        Polars DataFrame with anomaly flags
    """
    if len(data) < 10:  # Need sufficient data
        return data.with_columns(pl.lit(False).alias('is_anomaly'))
    
    # Calculate price change percentages using Polars
    data = data.with_columns(
        (pl.col('close').pct_change()).alias('price_change')
    )
    
    # Calculate statistics
    price_change_stats = data.select([
        pl.col('price_change').std().alias('std'),
        pl.col('price_change').mean().alias('mean')
    ]).row(0)
    
    change_std = price_change_stats[0]
    change_mean = price_change_stats[1]
    
    if change_std is None or change_mean is None:
        return data.with_columns(pl.lit(False).alias('is_anomaly'))
    
    # Detect extreme movements (beyond 3 standard deviations)
    anomaly_threshold = 3 * change_std
    data = data.with_columns(
        ((pl.col('price_change') - change_mean).abs() > anomaly_threshold).alias('is_anomaly')
    )
    
    # Count anomalies
    anomaly_count = data.filter(pl.col('is_anomaly')).height
    
    if anomaly_count > 0:
        logger.warning(f"Detected {anomaly_count} potential anomalies in {symbol}")
    
    # Drop the temporary price_change column
    data = data.drop('price_change')
    
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


def save_data_to_parquet(data: pl.DataFrame, symbol: str, output_dir: str) -> None:
    """
    Save data to parquet files organized by symbol and year.
    
    Args:
        data: Polars DataFrame with historical data
        symbol: Stock symbol
        output_dir: Base directory for saving files
    """
    try:
        # Create output directory
        base_path = Path(output_dir)
        base_path.mkdir(parents=True, exist_ok=True)
        
        # Convert timestamp to datetime if it's not already
        if data['timestamp'].dtype != pl.Datetime:
            data = data.with_columns(
                pl.col('timestamp').str.to_datetime()
            )
        
        # Group by year and save separately
        years = data.select(
            pl.col('timestamp').dt.year().alias('year')
        ).unique().sort('year')
        
        for year_row in years.iter_rows():
            year = year_row[0]
            
            # Filter data for this year
            year_data = data.filter(
                pl.col('timestamp').dt.year() == year
            )
            
            # Create symbol directory
            symbol_dir = base_path / symbol
            symbol_dir.mkdir(exist_ok=True)
            
            # Save as parquet
            filename = f"{symbol}_{year}.parquet"
            filepath = symbol_dir / filename
            
            year_data.write_parquet(filepath)
            logger.info(f"Saved {len(year_data)} records to {filepath}")
            
    except Exception as e:
        logger.error(f"Failed to save data for {symbol}: {str(e)}")


def load_data_from_parquet(
    symbol: str, 
    year: Optional[int] = None,
    output_dir: str = "data/raw"
) -> Optional[pl.DataFrame]:
    """
    Load data from parquet files.
    
    Args:
        symbol: Stock symbol
        year: Specific year to load (if None, loads all years)
        output_dir: Base directory where files are saved
        
    Returns:
        Polars DataFrame with historical data or None if not found
    """
    try:
        base_path = Path(output_dir) / symbol
        
        if not base_path.exists():
            logger.warning(f"No data directory found for {symbol}")
            return None
        
        if year:
            # Load specific year
            filepath = base_path / f"{symbol}_{year}.parquet"
            if filepath.exists():
                return pl.read_parquet(filepath)
            else:
                logger.warning(f"No data file found for {symbol} year {year}")
                return None
        else:
            # Load all years and concatenate
            parquet_files = list(base_path.glob(f"{symbol}_*.parquet"))
            
            if not parquet_files:
                logger.warning(f"No parquet files found for {symbol}")
                return None
            
            # Read and concatenate all files
            dataframes = [pl.read_parquet(file) for file in parquet_files]
            combined_df = pl.concat(dataframes)
            
            return combined_df.sort('timestamp')
            
    except Exception as e:
        logger.error(f"Failed to load data for {symbol}: {str(e)}")
        return None


# Pipeline Composition Functions
def fetch_and_validate_data(
    symbols: Union[str, List[str]],
    period: str = "1y",
    interval: str = "1d"
) -> Dict[str, pl.DataFrame]:
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
    # TODO: move to config
    asset_symbols = {
        'stocks': ['AAPL', 'MSFT', 'GOOGL'],
        'crypto': ['BTC-USD', 'ETH-USD', 'XRP-USD'],
        'commodities': ['GC=F', 'CL=F', 'ZC=F'],
    }
    symbols = [
        'AAPL', 'MSFT', 'GOOGL',  # stocks
        'BTC-USD', 'ETH-USD', 'XRP-USD',  # crypto
        'GC=F', 'CL=F', 'ZC=F',  # commodities
        ]
    
    # Fetch data using the pipeline function
    data = fetch_and_validate_data(symbols, period="5y", interval="1d")
    
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
        print(f"  Latest Close: ${df['close'].last():.2f}") 


if __name__ == "__main__":
    main()