import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton
} from '@mui/material'
import { 
  TrendingUp,
  Home as HomeIcon,
  ShowChart as StocksIcon,
  CurrencyBitcoin as CryptoIcon
} from '@mui/icons-material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSeedling } from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation } from 'react-router-dom'

export function Navigation() {
  const location = useLocation()

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        {/* Logo and Brand */}
        <IconButton 
          edge="start" 
          color="inherit" 
          component={Link} 
          to="/"
          sx={{ mr: 1 }}
        >
          <TrendingUp />
        </IconButton>
        
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            letterSpacing: '0.5px'
          }}
        >
          AssetAnalytics
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/"
            startIcon={<HomeIcon />}
            variant={location.pathname === '/' ? 'outlined' : 'text'}
            sx={{ 
              borderColor: location.pathname === '/' ? 'rgba(255,255,255,0.5)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Home
          </Button>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/stocks"
            startIcon={<StocksIcon />}
            variant={location.pathname === '/stocks' ? 'outlined' : 'text'}
            sx={{ 
              borderColor: location.pathname === '/stocks' ? 'rgba(255,255,255,0.5)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Stocks
          </Button>

          <Button 
            color="inherit" 
            component={Link} 
            to="/crypto"
            startIcon={<CryptoIcon />}
            variant={location.pathname === '/crypto' ? 'outlined' : 'text'}
            sx={{ 
              borderColor: location.pathname === '/crypto' ? 'rgba(255,255,255,0.5)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Crypto
          </Button>

          <Button 
            color="inherit" 
            component={Link} 
            to="/commodities"
            startIcon={<FontAwesomeIcon icon={faSeedling} />}
            variant={location.pathname === '/commodities' ? 'outlined' : 'text'}
            sx={{ 
              borderColor: location.pathname === '/commodities' ? 'rgba(255,255,255,0.5)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Commodities
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}