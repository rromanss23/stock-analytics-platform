import yfinance as yf
import logging
from typing import List, Tuple

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


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
