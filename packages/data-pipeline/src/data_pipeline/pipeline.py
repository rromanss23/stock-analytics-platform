import logging
import warnings
import polars as pl
from data_pipeline.storage.parquet_handler import load_data_from_parquet
from data_pipeline.fetchers.fetch_yahoo import fetch_and_validate_data, fetch_asset_info
from data_pipeline.fetchers.utils import determine_asset_type

# Suppress yfinance warnings
warnings.filterwarnings("ignore", category=FutureWarning)
logger = logging.getLogger(__name__)


def main():
    """Example usage for CLI integration."""
    logging.basicConfig(level=logging.INFO)
    
    # Example symbols organized by asset type
    asset_symbols = {
        'stocks': ['AAPL', 'MSFT', 'GOOGL'],
        'crypto': ['BTC-USD', 'ETH-USD', 'XRP-USD'],
        'commodities': ['GC=F', 'CL=F', 'ZC=F'],
    }
    
    # Fetch data using the pipeline function
    data = fetch_and_validate_data(asset_symbols, period="max", interval="1d")
    
    # Fetch asset info
    asset_info = fetch_asset_info(list(data.keys()))
    
    # Display results
    for symbol in data:
        df = data[symbol]
        info = asset_info[symbol]
        print(f"\n{symbol} ({info.name}):")
        print(f"  Asset Type: {info.asset_type}")
        print(f"  Records: {len(df)}")
        
        # Get timestamp range using Polars
        timestamp_min = df.select(pl.col('timestamp').min()).item()
        timestamp_max = df.select(pl.col('timestamp').max()).item()
        latest_close = df.select(pl.col('close').last()).item()
        
        print(f"  Date Range: {timestamp_min} to {timestamp_max}")
        print(f"  Latest Close: ${latest_close:.2f}")
        
        # Show sample of data
        print(f"  Sample data:")
        print(df.head(3))
        
        # Test loading from parquet (determine asset type from symbol)
        asset_type = determine_asset_type(symbol, {})
        print(f"\n  Testing parquet load for {symbol} ({asset_type}):")
        loaded_data = load_data_from_parquet(symbol, asset_type, output_dir="data/raw")
        if loaded_data is not None:
            print(f"  Successfully loaded {len(loaded_data)} records from parquet files")


if __name__ == "__main__":
    main()