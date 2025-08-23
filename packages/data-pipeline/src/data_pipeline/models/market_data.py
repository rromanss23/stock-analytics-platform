from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator


class MarketDataPoint(BaseModel):
    """
    Validated market data point for OHLCV financial data.
    
    Ensures data integrity through validation of:
    - Positive price values
    - Non-negative volume
    - Logical OHLC relationships (high >= max(open, close), low <= min(open, close))
    
    Financial data anomalies will raise validation errors to prevent
    corrupted data from entering the pipeline.
    """
    symbol: str
    timestamp: datetime
    open: float = Field(gt=0, description="Opening price (must be positive)")
    high: float = Field(gt=0, description="High price (must be positive)")
    low: float = Field(gt=0, description="Low price (must be positive)")
    close: float = Field(gt=0, description="Closing price (must be positive)")
    volume: int = Field(ge=0, description="Volume (must be non-negative)")
    adj_close: Optional[float] = Field(default=None, gt=0, description="Adjusted closing price")
    
    @field_validator('high', 'low', 'close')
    @classmethod
    def validate_ohlc_relationships(cls, v, info):
        """
        Validate OHLC price relationships for data integrity.
        
        Financial markets have logical constraints:
        - High price must be >= max(open, close)
        - Low price must be <= min(open, close)
        
        This prevents obviously corrupted data from entering the system.
        """
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

    class Config:
        """Pydantic configuration for performance and validation."""
        # Enable JSON schema generation for API documentation
        json_schema_extra = {
            "example": {
                "symbol": "AAPL",
                "timestamp": "2023-12-01T16:00:00Z",
                "open": 189.50,
                "high": 191.75,
                "low": 188.25,
                "close": 190.33,
                "volume": 45123456,
                "adj_close": 190.33
            }
        }