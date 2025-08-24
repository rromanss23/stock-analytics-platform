from typing import Optional
from pydantic import BaseModel, Field


class AssetInfo(BaseModel):
    """
    Asset information and metadata for financial instruments.
    
    Provides comprehensive metadata about financial assets including
    fundamental data, classification, and exchange information.
    
    Used for:
    - Asset classification and filtering
    - Risk management and portfolio construction
    - Market hours and trading rules
    - Fundamental analysis integration
    """
    symbol: str = Field(description="Asset symbol (e.g., AAPL, BTC-USD)")
    name: Optional[str] = Field(default=None, description="Full asset name")
    sector: Optional[str] = Field(default=None, description="Business sector")
    market_cap: Optional[float] = Field(default=None, ge=0, description="Market capitalization in USD")
    currency: Optional[str] = Field(default=None, description="Trading currency")
    exchange: Optional[str] = Field(default=None, description="Primary exchange")
    asset_type: str = Field(default="stock", description="Asset classification")
    
    class Config:
        """Pydantic configuration."""
        json_schema_extra = {
            "example": {
                "symbol": "AAPL",
                "name": "Apple Inc.",
                "sector": "Technology",
                "market_cap": 2750000000000,
                "currency": "USD",
                "exchange": "NASDAQ",
                "asset_type": "stock"
            }
        }