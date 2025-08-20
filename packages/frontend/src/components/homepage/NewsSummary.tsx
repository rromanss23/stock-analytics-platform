import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  Divider
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  OpenInNew,
  Article
} from '@mui/icons-material'

// Mock news data
const mockNews = [
  {
    id: 1,
    title: 'Tech Stocks Rally on AI Breakthrough',
    summary: 'Major technology companies see significant gains following artificial intelligence developments.',
    impact: 'positive' as const,
    timestamp: '2 hours ago',
    source: 'Financial Times'
  },
  {
    id: 2,
    title: 'Federal Reserve Maintains Interest Rates',
    summary: 'Central bank keeps rates steady, citing economic stability concerns.',
    impact: 'neutral' as const,
    timestamp: '4 hours ago',
    source: 'Reuters'
  },
  {
    id: 3,
    title: 'Energy Sector Faces Volatility',
    summary: 'Oil prices fluctuate amid geopolitical tensions and supply chain concerns.',
    impact: 'negative' as const,
    timestamp: '6 hours ago',
    source: 'Bloomberg'
  },
  {
    id: 4,
    title: 'Cryptocurrency Market Shows Mixed Signals',
    summary: 'Bitcoin and Ethereum experience divergent price movements in volatile trading session.',
    impact: 'neutral' as const,
    timestamp: '8 hours ago',
    source: 'CoinDesk'
  }
]

const getImpactIcon = (impact: string) => {
  switch (impact) {
    case 'positive':
      return <TrendingUp color="success" />
    case 'negative':
      return <TrendingDown color="error" />
    default:
      return <TrendingFlat color="action" />
  }
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'positive':
      return 'success'
    case 'negative':
      return 'error'
    default:
      return 'default'
  }
}

export function NewsSummary() {
  return (
    <Card elevation={1}>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Article color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="h2" fontWeight={600}>
            Market News Summary
          </Typography>
        </Box>

        {/* News Items */}
        <Stack spacing={2}>
          {mockNews.map((news, index) => (
            <Box key={news.id}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                {/* Impact Indicator */}
                <Box sx={{ mt: 0.5 }}>
                  {getImpactIcon(news.impact)}
                </Box>

                {/* Content */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    mb: 1
                  }}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={600}
                      sx={{ 
                        color: 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flexGrow: 1,
                        mr: 1
                      }}
                    >
                      {news.title}
                    </Typography>
                    
                    <IconButton
                      size="small"
                      sx={{ 
                        opacity: 0.7,
                        '&:hover': { opacity: 1 }
                      }}
                    >
                      <OpenInNew fontSize="small" />
                    </IconButton>
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, lineHeight: 1.5 }}
                  >
                    {news.summary}
                  </Typography>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between'
                  }}>
                    <Typography variant="caption" color="text.secondary">
                      {news.source} • {news.timestamp}
                    </Typography>
                    
                    <Chip
                      label={news.impact}
                      size="small"
                      color={getImpactColor(news.impact) as any}
                      variant="outlined"
                      sx={{ 
                        textTransform: 'capitalize',
                        fontSize: '0.75rem',
                        height: 24
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              
              {/* Divider between items */}
              {index < mockNews.length - 1 && (
                <Divider sx={{ mt: 2 }} />
              )}
            </Box>
          ))}
        </Stack>

        {/* Footer */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}