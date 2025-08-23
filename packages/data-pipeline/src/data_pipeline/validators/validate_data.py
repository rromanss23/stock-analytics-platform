import polars as pl
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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