import time
import logging
from typing import Dict, List, Optional, Union
import yfinance as yf
import polars as pl
from data_pipeline.models import AssetInfo
from data_pipeline.validators.validate_data import validate_and_clean_data
from data_pipeline.storage.parquet_handler import save_data_to_parquet
from data_pipeline.fetchers.validate_symbol import validate_symbols
from data_pipeline.fetchers.utils import determine_asset_type

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration
DEFAULT_CONFIG = {
    'max_retries': 3,
    'retry_delay': 1.0,
    'timeout': 30,
    'validate_data': True,
    'output_dir': 'data/raw',  # Directory to save parquet files
    'save_to_parquet': True
}


def fetch_and_validate_data(
    asset_symbols: Dict[str, List[str]],
    period: str = "1y",
    interval: str = "1d"
) -> Dict[str, pl.DataFrame]:
    """
    Complete pipeline: fetch + validate symbols, then fetch data.
    
    This is the main function for CLI usage.
    
    Args:
        asset_symbols: Dictionary categorizing symbols by asset type
                      e.g., {'stocks': ['AAPL', 'MSFT'], 'crypto': ['BTC-USD']}
        period: Data period
        interval: Data interval
        
    Returns:
        Dictionary mapping symbols to Polars DataFrames
    """
    # Flatten all symbols for validation
    all_symbols = []
    for symbols in asset_symbols.values():
        all_symbols.extend(symbols)

    # Validate symbols first
    valid_symbols, invalid_symbols = validate_symbols(all_symbols)

    if invalid_symbols:
        logger.warning(f"Invalid symbols (skipping): {invalid_symbols}")
    
    if not valid_symbols:
        logger.error("No valid symbols provided")
        return {}
    
    # Filter asset_symbols to only include valid symbols
    filtered_asset_symbols = {}
    for asset_type, symbols in asset_symbols.items():
        valid_symbols_for_type = [s for s in symbols if s in valid_symbols]
        if valid_symbols_for_type:
            filtered_asset_symbols[asset_type] = valid_symbols_for_type
    
    # Fetch historical data
    historical_data = fetch_historical_data(
        asset_symbols=filtered_asset_symbols,
        period=period,
        interval=interval
    )
    
    return historical_data


def fetch_historical_data(
    asset_symbols: Dict[str, List[str]],
    period: str = "1y",
    interval: str = "1d",
    start: Optional[str] = None,
    end: Optional[str] = None,
    config: Optional[Dict] = None
) -> Dict[str, pl.DataFrame]:
    """
    Fetch historical data for symbols organized by asset type.
    
    Args:
        asset_symbols: Dictionary categorizing symbols by asset type
                      e.g., {'stocks': ['AAPL', 'MSFT'], 'crypto': ['BTC-USD']}
        period: Data period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
        interval: Data interval (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)
        start: Start date (YYYY-MM-DD)
        end: End date (YYYY-MM-DD)
        config: Configuration overrides
        
    Returns:
        Dictionary mapping symbols to Polars DataFrames with historical data
    """
    cfg = {**DEFAULT_CONFIG, **(config or {})}
    
    results = {}
    
    # Process each asset type and its symbols
    for asset_type, symbols in asset_symbols.items():
        logger.info(f"Processing {asset_type} with {len(symbols)} symbols")
        
        for symbol in symbols:
            try:
                logger.info(f"Fetching historical data for {symbol} ({asset_type})")
                data = _fetch_single_symbol_with_retry(symbol, period, interval, start, end, cfg)
                
                if data is not None and not data.is_empty():
                    if cfg['validate_data']:
                        data = validate_and_clean_data(data, symbol)
                    
                    if not data.is_empty():
                        # Save to parquet files by year if enabled
                        if cfg['save_to_parquet']:
                            # Create asset-type specific output directory
                            output_dir = f"{cfg['output_dir']}/{asset_type}"
                            save_data_to_parquet(data, symbol, output_dir)

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
    max_retries = config['max_retries']
    retry_delay = config['retry_delay']
    
    for attempt in range(max_retries):
        try:
            ticker = yf.Ticker(symbol)
            
            # Fetch data with appropriate parameters
            if start and end:
                hist = ticker.history(start=start, end=end, interval=interval)
            else:
                hist = ticker.history(period=period, interval=interval)
            
            if hist.empty:
                logger.warning(f"No data returned for {symbol} (attempt {attempt + 1})")
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                    continue
                return None
            
            # Convert to Polars DataFrame
            hist_reset = hist.reset_index()
            
            # Standardize column names
            column_mapping = {
                'Date': 'timestamp',
                'Datetime': 'timestamp', 
                'Open': 'open',
                'High': 'high',
                'Low': 'low',
                'Close': 'close',
                'Volume': 'volume',
                'Adj Close': 'adj_close'
            }
            
            # Rename columns if they exist
            for old_name, new_name in column_mapping.items():
                if old_name in hist_reset.columns:
                    hist_reset = hist_reset.rename(columns={old_name: new_name})
            
            # Convert to Polars
            df = pl.from_pandas(hist_reset)
            
            # Add symbol column
            df = df.with_columns(pl.lit(symbol).alias('symbol'))
            
            # Ensure we have required columns
            required_cols = ['timestamp', 'open', 'high', 'low', 'close', 'volume']
            missing_cols = [col for col in required_cols if col not in df.columns]
            
            if missing_cols:
                logger.error(f"Missing required columns for {symbol}: {missing_cols}")
                return None
            
            # Convert timestamp to datetime if it's not already
            if df['timestamp'].dtype != pl.Datetime:
                df = df.with_columns(
                    pl.col('timestamp').cast(pl.Datetime).alias('timestamp')
                )
            
            logger.info(f"Successfully fetched {len(df)} records for {symbol}")
            return df
            
        except Exception as e:
            logger.warning(f"Attempt {attempt + 1} failed for {symbol}: {str(e)}")
            if attempt < max_retries - 1:
                time.sleep(retry_delay * (2 ** attempt))  # Exponential backoff
            else:
                logger.error(f"All retry attempts failed for {symbol}")
                return None
    
    return None


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