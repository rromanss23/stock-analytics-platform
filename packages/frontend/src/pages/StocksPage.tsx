import { useState } from 'react'
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip
} from '@mui/material'
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid'
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat
} from '@mui/icons-material'

// Mock data for stocks table (matching your UI design)
const mockStocksData = [
  {
    id: 1,
    symbol: 'AAPL',
    company: 'Apple Inc.',
    weight: '7.0%',
    price: 175.43,
    change1d: 1.35,
    change7d: 2.84,
    marketCap: '2.75T'
  },
  {
    id: 2,
    symbol: 'MSFT',
    company: 'Microsoft Corporation',
    weight: '6.8%',
    price: 378.85,
    change1d: 1.52,
    change7d: -0.73,
    marketCap: '2.81T'
  },
  {
    id: 3,
    symbol: 'AMZN',
    company: 'Amazon.com Inc.',
    weight: '3.2%',
    price: 145.12,
    change1d: 0.68,
    change7d: 4.21,
    marketCap: '1.51T'
  },
  {
    id: 4,
    symbol: 'GOOGL',
    company: 'Alphabet Inc.',
    weight: '4.1%',
    price: 141.80,
    change1d: -0.87,
    change7d: 1.95,
    marketCap: '1.78T'
  },
  {
    id: 5,
    symbol: 'TSLA',
    company: 'Tesla Inc.',
    weight: '1.9%',
    price: 248.50,
    change1d: -3.24,
    change7d: -8.15,
    marketCap: '789.2B'
  },
  {
    id: 6,
    symbol: 'META',
    company: 'Meta Platforms Inc.',
    weight: '2.3%',
    price: 325.67,
    change1d: 2.18,
    change7d: 5.42,
    marketCap: '826.4B'
  },
  {
    id: 7,
    symbol: 'NVDA',
    company: 'NVIDIA Corporation',
    weight: '4.5%',
    price: 875.28,
    change1d: 4.73,
    change7d: 12.86,
    marketCap: '2.16T'
  }
]

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value)
}

const formatPercentage = (value: number) => {
  const color = value >= 0 ? 'success.main' : 'error.main'
  const sign = value >= 0 ? '+' : ''
  return {
    value: `${sign}${value.toFixed(2)}%`,
    color,
    icon: value >= 0 ? <TrendingUp fontSize="small" /> : 
          value < 0 ? <TrendingDown fontSize="small" /> : 
          <TrendingFlat fontSize="small" />
  }
}

export function StocksPage() {
  const [selectedIndex, setSelectedIndex] = useState('SP500')

  const columns: GridColDef[] = [
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
      field: 'company',
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
      field: 'weight',
      headerName: 'Index Weight',
      width: 120,
      align: 'right',
      headerAlign: 'right'
    },
    {
      field: 'price',
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
      renderCell: (params) => {
        const formatted = formatPercentage(params.value)
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
        )
      }
    },
    {
      field: 'change7d',
      headerName: '% Chg 7d',
      width: 130,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => {
        const formatted = formatPercentage(params.value)
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
        )
      }
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
  ]

  const handleRowClick = (params: GridRowParams) => {
    // TODO: Navigate to detailed stock view
    console.log('Selected stock:', params.row.symbol)
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
          Stocks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analyze stocks from major indices with real-time data and predictions
        </Typography>
      </Box>

      {/* Index Selector */}
      <Card elevation={1} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Select Index</InputLabel>
              <Select
                value={selectedIndex}
                label="Select Index"
                onChange={(e) => setSelectedIndex(e.target.value)}
              >
                <MenuItem value="SP500">S&P 500</MenuItem>
                <MenuItem value="NASDAQ100">NASDAQ 100</MenuItem>
                <MenuItem value="DOW30">Dow Jones 30</MenuItem>
                <MenuItem value="RUSSELL2000">Russell 2000</MenuItem>
              </Select>
            </FormControl>
            
            <Chip 
              label={`${mockStocksData.length} stocks`} 
              variant="outlined" 
              color="primary" 
            />
          </Box>
        </CardContent>
      </Card>

      {/* Stocks Data Grid */}
      <Card elevation={1}>
        <CardContent sx={{ p: 0 }}>
          <DataGrid
            rows={mockStocksData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25,
                },
              },
              sorting: {
                sortModel: [{ field: 'marketCap', sort: 'desc' }],
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            onRowClick={handleRowClick}
            sx={{
              border: 'none',
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'action.hover',
                cursor: 'pointer'
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'grey.50',
                borderBottom: '2px solid',
                borderColor: 'divider'
              },
              '& .MuiDataGrid-cell': {
                borderColor: 'divider'
              }
            }}
            disableRowSelectionOnClick
            autoHeight
          />
        </CardContent>
      </Card>
    </Box>
  )
}