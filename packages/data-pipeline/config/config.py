# Configuration
DEFAULT_CONFIG = {
    'max_retries': 3,
    'retry_delay': 1.0,
    'timeout': 30,
    'validate_data': True,
    'output_dir': 'data/raw',  # Directory to save parquet files
    'save_to_parquet': True
}

# Assets to fetch
asset_symbols = {
    'stocks': ['AAPL', 'MSFT', 'GOOGL'],
    'crypto': ['BTC-USD', 'ETH-USD', 'XRP-USD'],
    'commodities': ['GC=F', 'CL=F', 'ZC=F'],
}