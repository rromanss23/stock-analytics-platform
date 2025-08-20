import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  ShowChart
} from '@mui/icons-material'

// Mock stock data
const mockStocks = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.43,
    change: 2.34,
    changePercent: 1.35,
    trend: 'up' as const
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 141.80,
    change: -1.25,
    changePercent: -0.87,
    trend: 'down' as const
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 378.85,
    change: 5.67,
    changePercent: 1.52,
    trend: 'up' as const
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.50,
    change: -8.32,
    changePercent: -3.24,
    trend: 'down' as const
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 145.12,
    change: 0.98,
    changePercent: 0.68,
    trend: 'up' as const
  }
]

const getTrendIcon = (trend: string) => {
  return trend === 'up' ? (
    <TrendingUp fontSize="small" color="success" />
  ) : (
    <TrendingDown fontSize="small" color="error" />
  )
}

const getTrendColor = (trend: string) => {
  return trend === 'up' ? 'success' : 'error'
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value)
}

const formatChange = (change: number, percent: number) => {
  const sign = change >= 0 ? '+' : ''
  return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`
}

export function MicroCharts() {
  return (
    <Card elevation={1}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ShowChart color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2" fontWeight={600}>
            Followed Assets
          </Typography>
        </Box>

        {/* Stock Table */}
        <TableContainer>
          <Table size="small" aria-label="followed stocks table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Symbol</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Change</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Trend</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockStocks.map((stock) => (
                <TableRow
                  key={stock.symbol}
                  hover
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  {/* Symbol */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 1,
                          bgcolor: 'primary.main',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}
                      >
                        {stock.symbol.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600}>
                        {stock.symbol}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Company Name */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: { xs: 120, sm: 200 }
                      }}
                    >
                      {stock.name}
                    </Typography>
                  </TableCell>

                  {/* Price */}
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(stock.price)}
                    </Typography>
                  </TableCell>

                  {/* Change */}
                  <TableCell align="right">
                    <Chip
                      label={formatChange(stock.change, stock.changePercent)}
                      size="small"
                      color={getTrendColor(stock.trend) as any}
                      variant="outlined"
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        minWidth: 100
                      }}
                    />
                  </TableCell>

                  {/* Trend */}
                  <TableCell align="center">
                    {getTrendIcon(stock.trend)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Footer */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Real-time data • Last updated: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}