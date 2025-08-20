// packages/frontend/src/pages/AssetDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  ButtonGroup,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Avatar,
} from '@mui/material';
import {
  ArrowBack,
  ShowChart,
  OnlinePrediction,
  Info,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

// Types and interfaces
import { AssetType, Asset } from '@/types/asset';
import { PricePoint, Prediction, TimePeriod, AssetDetailPageProps } from '@/types/assetDetail';

// Data and utilities
import { mockStocksData, mockCryptoData, mockCommoditiesData } from '@/data/mockData';
import { generateMockHistoricalData, generateMockPredictions } from '@/services/mockDataGenerators';
import { 
  formatCurrency, 
  formatPercentage, 
  CustomTooltip, 
  CHART_CONFIGS,
  TIME_PERIOD_LABELS 
} from '@/utils/chartUtils';

export function AssetDetailPage({ assetType }: AssetDetailPageProps) {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  
  // State management
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1m');
  const [historicalData, setHistoricalData] = useState<PricePoint[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get asset data based on type
  const getAssetData = (symbol: string, type: AssetType): Asset | null => {
    const dataMap = {
      stock: mockStocksData,
      crypto: mockCryptoData,
      commodity: mockCommoditiesData,
    };
    
    return dataMap[type].find(asset => asset.symbol === symbol) || null;
  };

  const asset = symbol ? getAssetData(symbol, assetType) : null;

  // Data loading effect
  useEffect(() => {
    if (!asset) {
      setError(`${assetType} with symbol "${symbol}" not found`);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate API call with realistic delay
    const timer = setTimeout(() => {
      try {
        const mockHistorical = generateMockHistoricalData(
          asset.symbol, 
          asset.currentPrice, 
          selectedPeriod,
          assetType
        );
        const mockPredictions = generateMockPredictions(
          asset.symbol,
          asset.currentPrice,
          assetType
        );
        
        setHistoricalData(mockHistorical);
        setPredictions(mockPredictions);
        setLoading(false);
      } catch (err) {
        setError('Failed to load asset data');
        setLoading(false);
      }
    }, 600 + Math.random() * 400); // 600-1000ms delay

    return () => clearTimeout(timer);
  }, [asset, selectedPeriod, symbol, assetType]);

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Error state
  if (error || !asset) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/${assetType === 'stock' ? 'stocks' : assetType}`)}
          sx={{ mb: 2 }}
        >
          Back to {assetType}s
        </Button>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || `Asset not found`}
        </Alert>
      </Box>
    );
  }

  // Format change indicators
  const change1d = formatPercentage(asset.change1d);
  const change7d = formatPercentage(asset.change7d);
  
  // Get chart configuration for asset type
  const chartConfig = CHART_CONFIGS[assetType] || CHART_CONFIGS.stock;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(`/${assetType === 'stock' ? 'stocks' : assetType}`)}
          sx={{ mb: 2 }}
        >
          Back to {assetType}s
        </Button>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              fontSize: '1.25rem',
              fontWeight: 600,
            }}
          >
            {asset.symbol.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={600}>
              {asset.name}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {asset.symbol}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Price Information Panel */}
        <Grid item xs={12} md={4} {...({} as any)}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Current Price</Typography>
              <Typography variant="h3" fontWeight={700} gutterBottom>
                {formatCurrency(asset.currentPrice, assetType)}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip
                  icon={change1d.icon}
                  label={`${change1d.value} (24h)`}
                  color={change1d.color}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  icon={change7d.icon}
                  label={`${change7d.value} (7d)`}
                  color={change7d.color}
                  variant="outlined"
                  size="small"
                />
              </Box>

              <Divider sx={{ my: 2 }} />
              
              {/* Asset-specific information */}
              {assetType === 'stock' && 'marketCap' in asset && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Market Cap</Typography>
                    <Typography variant="body2" fontWeight={600}>${asset.marketCap}</Typography>
                  </Box>
                  {'pe_ratio' in asset && asset.pe_ratio && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">P/E Ratio</Typography>
                      <Typography variant="body2" fontWeight={600}>{asset.pe_ratio}</Typography>
                    </Box>
                  )}
                  {'sector' in asset && asset.sector && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Sector</Typography>
                      <Typography variant="body2" fontWeight={600}>{asset.sector}</Typography>
                    </Box>
                  )}
                </>
              )}
              
              {assetType === 'crypto' && 'rank' in asset && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Market Cap</Typography>
                    <Typography variant="body2" fontWeight={600}>${asset.marketCap}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Rank</Typography>
                    <Typography variant="body2" fontWeight={600}>#{asset.rank}</Typography>
                  </Box>
                  {'circulatingSupply' in asset && asset.circulatingSupply && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Circulating Supply</Typography>
                      <Typography variant="body2" fontWeight={600}>{asset.circulatingSupply}</Typography>
                    </Box>
                  )}
                </>
              )}
              
              {assetType === 'commodity' && 'unit' in asset && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">Unit</Typography>
                    <Typography variant="body2" fontWeight={600}>{asset.unit}</Typography>
                  </Box>
                  {'exchange' in asset && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Exchange</Typography>
                      <Typography variant="body2" fontWeight={600}>{asset.exchange}</Typography>
                    </Box>
                  )}
                  {'category' in asset && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">Category</Typography>
                      <Typography variant="body2" fontWeight={600}>{asset.category}</Typography>
                    </Box>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Price Chart Panel */}
        <Grid item xs={12} md={8} {...({} as any)}>
          <Card elevation={1}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShowChart color="primary" />
                  <Typography variant="h6" fontWeight={600}>Price History</Typography>
                </Box>
                <ButtonGroup size="small" variant="outlined">
                  {(['1d', '7d', '1m', '3m', '6m', '1y'] as const).map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? 'contained' : 'outlined'}
                      onClick={() => setSelectedPeriod(period)}
                    >
                      {TIME_PERIOD_LABELS[period]}
                    </Button>
                  ))}
                </ButtonGroup>
              </Box>
              
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray={chartConfig.gridStrokeDasharray} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis 
                    domain={[
                      (dataMin: number) => (dataMin * 0.995), 
                      (dataMax: number) => (dataMax * 1.005)
                    ]}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => formatCurrency(value, assetType)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke="#1976d2"
                    strokeWidth={chartConfig.strokeWidth}
                    dot={false}
                    activeDot={{ r: chartConfig.activeDotRadius }}
                  />
                  <ReferenceLine 
                    y={asset.currentPrice}  
                    stroke={chartConfig.referenceLineStroke}
                    strokeDasharray={chartConfig.referenceLineStrokeDasharray}
                    label={{ value: "Current", position: "insideTopLeft" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Predictions Panel */}
        <Grid item xs={12} {...({} as any)}>
          <Card elevation={1}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <OnlinePrediction color="primary" />
                <Typography variant="h6" fontWeight={600}>Price Predictions</Typography>
                <IconButton size="small">
                  <Info fontSize="small" />
                </IconButton>
              </Box>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  These predictions are generated using machine learning models and should not be considered as financial advice. 
                  Past performance does not guarantee future results.
                </Typography>
              </Alert>

              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { 
                  xs: '1fr', 
                  sm: 'repeat(2, 1fr)', 
                  md: 'repeat(4, 1fr)' 
                }, 
                gap: 2 
              }}>
                {predictions.map((prediction, index) => {
                  const priceChange = ((prediction.predictedPrice - asset.currentPrice) / asset.currentPrice) * 100;
                  const change = formatPercentage(priceChange);
                  
                  return (
                    <Paper key={index} sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {prediction.targetDate}
                      </Typography>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {formatCurrency(prediction.predictedPrice, assetType)}
                      </Typography>
                      <Chip
                        icon={change.icon}
                        label={change.value}
                        color={change.color}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      <Typography variant="caption" display="block" color="text.secondary">
                        Confidence: {(prediction.confidence * 100).toFixed(0)}%
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {prediction.methodology}
                      </Typography>
                    </Paper>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}