// packages/frontend/src/config/assets.tsx
import { Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown, TrendingFlat } from '@mui/icons-material';
import { 
  Stock, 
  Crypto, 
  Commodity, 
  AssetConfig, 
  StockIndex, 
  CryptoIndex, 
  CommodityIndex 
} from '@/types/asset';

// Utility formatters
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
};

export const formatPercentage = (value: number) => {
  const color = value >= 0 ? 'success.main' : 'error.main';
  const sign = value >= 0 ? '+' : '';
  return {
    value: `${sign}${value.toFixed(2)}%`,
    color,
    icon: value >= 0 ? <TrendingUp fontSize="small" /> : 
          value < 0 ? <TrendingDown fontSize="small" /> : 
          <TrendingFlat fontSize="small" />
  };
};

const createPercentageCell = (params: { value: number }) => {
  const formatted = formatPercentage(params.value);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
      <Typography 
        variant="body2" 
        sx={{ color: formatted.color, mr: 0.5 }}
      >
        {formatted.value}
      </Typography>
      <Box sx={{ color: formatted.color, display: 'flex' }}>
        {formatted.icon}
      </Box>
    </Box>
  );
};

// Stock Configuration
export const stockConfig: AssetConfig<Stock, StockIndex> = {
  assetType: 'stock',
  title: 'Stocks',
  description: 'Analyze stocks from major indices with real-time data and predictions',
  indexOptions: [
    { value: 'SP500', label: 'S&P 500' },
    { value: 'NASDAQ100', label: 'NASDAQ 100' },
    { value: 'DOW30', label: 'Dow Jones 30' },
    { value: 'RUSSELL2000', label: 'Russell 2000' },
  ],
  defaultIndex: 'SP500',
  columns: [
    {
      field: 'symbol',
      headerName: 'Symbol',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="primary">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'name',
      headerName: 'Company',
      width: 250,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {params.value}
        </Typography>
      )
    },
    {
    field: 'indexWeight',
    headerName: 'Index Weight',
    width: 120,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
        {params.value}
        </Typography>
    )
    },
    {
      field: 'currentPrice',
      headerName: 'Price',
      width: 120,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>
          {formatCurrency(params.value)}
        </Typography>
      )
    },
    {
      field: 'change1d',
      headerName: '% Chg 1d',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: createPercentageCell
    },
    {
      field: 'change7d',
      headerName: '% Chg 7d',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: createPercentageCell
    },
    {
      field: 'marketCap',
      headerName: 'Market Cap',
      width: 120,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          ${params.value}
        </Typography>
      )
    }
  ],
  formatters: {
    currency: formatCurrency,
    percentage: formatPercentage
  }
};

// Crypto Configuration
export const cryptoConfig: AssetConfig<Crypto, CryptoIndex> = {
  assetType: 'crypto',
  title: 'Cryptocurrency',
  description: 'Track digital assets and cryptocurrencies with real-time market data',
  indexOptions: [
    { value: 'TOP100', label: 'Top 100' },
    { value: 'DEFI', label: 'DeFi Tokens' },
    { value: 'LAYER1', label: 'Layer 1 Protocols' },
    { value: 'MEME', label: 'Meme Coins' },
  ],
  defaultIndex: 'TOP100',
  columns: [
    {
      field: 'symbol',
      headerName: 'Symbol',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="primary">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'rank',
      headerName: 'Rank',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          #{params.value}
        </Typography>
      )
    },
    {
      field: 'currentPrice',
      headerName: 'Price',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>
          {formatCurrency(params.value)}
        </Typography>
      )
    },
    {
      field: 'change1d',
      headerName: '% Chg 24h',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: createPercentageCell
    },
    {
      field: 'change7d',
      headerName: '% Chg 7d',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: createPercentageCell
    },
    {
      field: 'marketCap',
      headerName: 'Market Cap',
      width: 140,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          ${params.value}
        </Typography>
      )
    }
  ],
  formatters: {
    currency: formatCurrency,
    percentage: formatPercentage
  }
};

// Commodity Configuration
export const commodityConfig: AssetConfig<Commodity, CommodityIndex> = {
  assetType: 'commodity',
  title: 'Commodities',
  description: 'Monitor commodity prices including precious metals, energy, and agriculture',
  indexOptions: [
    { value: 'PRECIOUS_METALS', label: 'Precious Metals' },
    { value: 'ENERGY', label: 'Energy' },
    { value: 'AGRICULTURE', label: 'Agriculture' },
    { value: 'INDUSTRIAL_METALS', label: 'Industrial Metals' },
  ],
  defaultIndex: 'PRECIOUS_METALS',
  columns: [
    {
      field: 'symbol',
      headerName: 'Symbol',
      width: 100,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600} color="primary">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'name',
      headerName: 'Commodity',
      width: 200,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {params.value}
        </Typography>
      )
    },
    {
      field: 'unit',
      headerName: 'Unit',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params)  => (
        <Typography variant="body2" fontWeight={500}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'exchange',
      headerName: 'Exchange',
      width: 100,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>
          {params.value}
        </Typography>
      )
    },
    {
      field: 'currentPrice',
      headerName: 'Price',
      width: 120,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={600}>
          {formatCurrency(params.value)}
        </Typography>
      )
    },
    {
      field: 'change1d',
      headerName: '% Chg 1d',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: createPercentageCell
    },
    {
      field: 'change7d',
      headerName: '% Chg 7d',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: createPercentageCell
    }
  ],
  formatters: {
    currency: formatCurrency,
    percentage: formatPercentage
  }
};