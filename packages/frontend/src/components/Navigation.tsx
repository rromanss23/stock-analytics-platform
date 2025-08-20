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
  ShowChart as StocksIcon
} from '@mui/icons-material'
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
          StockAnalytics
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
        </Box>
      </Toolbar>
    </AppBar>
  )
}