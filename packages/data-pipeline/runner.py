import logging
import warnings
from core.fetch_data import fetch_and_validate_data, fetch_asset_info
from config.config import asset_symbols

# Suppress yfinance warnings
warnings.filterwarnings("ignore", category=FutureWarning)
logger = logging.getLogger(__name__)


def run_pipeline() -> bool:
    """Example usage for CLI integration."""
    logging.basicConfig(level=logging.INFO)

    
    # Fetch data using the pipeline function and save to parquet
    data = fetch_and_validate_data(asset_symbols, period="max", interval="1d")
    
    # Fetch asset info
    asset_info = fetch_asset_info(list(data.keys()))

    # Transform data

    # Upload data to supabase
    
    # Display results


if __name__ == "__main__":
    run_pipeline()