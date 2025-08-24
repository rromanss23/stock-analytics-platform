import polars as pl
import logging
from pathlib import Path
from typing import Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def save_data_to_parquet(data: pl.DataFrame, symbol: str, output_dir: str) -> None:
    """
    Save data to parquet files organized by symbol and year.
    
    Args:
        data: Polars DataFrame with historical data
        symbol: Stock symbol
        output_dir: Base directory for saving files (includes asset type)
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
    asset_type: str,
    year: Optional[int] = None,
    output_dir: str = "data/raw"
) -> Optional[pl.DataFrame]:
    """
    Load data from parquet files organized by asset type.
    
    Args:
        symbol: Stock symbol
        asset_type: Asset type (stocks, crypto, commodities, etc.)
        year: Specific year to load (if None, loads all years)
        output_dir: Base directory where files are saved
        
    Returns:
        Polars DataFrame with historical data or None if not found
    """
    try:
        base_path = Path(output_dir) / asset_type / symbol
        
        if not base_path.exists():
            logger.warning(f"No data directory found for {symbol} in {asset_type}")
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