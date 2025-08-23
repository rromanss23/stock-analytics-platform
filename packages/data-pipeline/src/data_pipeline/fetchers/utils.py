import yfinance as yf
import logging
from typing import Dict
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

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