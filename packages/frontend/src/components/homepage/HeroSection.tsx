import {
  Box,
  Typography,
  Button,
  Stack,
  Avatar
} from '@mui/material'
import {
  TrendingUp,
  Analytics,
  ArrowForward
} from '@mui/icons-material'
import { Link } from 'react-router-dom'

export function HeroSection() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 6, md: 8 },
        px: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        mb: 4,
        boxShadow: 1
      }}
    >
      {/* Logo/Icon */}
      <Avatar
        sx={{
          width: { xs: 80, md: 100 },
          height: { xs: 80, md: 100 },
          mx: 'auto',
          mb: 3,
          bgcolor: 'primary.main',
          fontSize: { xs: '2rem', md: '2.5rem' }
        }}
      >
        <TrendingUp fontSize="inherit" />
      </Avatar>

      {/* Main Heading */}
      <Typography
        variant="h2"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          color: 'text.primary',
          mb: 2
        }}
      >
        Smart Stock Analytics
      </Typography>

      {/* Subtitle */}
      <Typography
        variant="h5"
        component="p"
        color="text.secondary"
        sx={{
          mb: 4,
          maxWidth: 600,
          mx: 'auto',
          fontSize: { xs: '1.1rem', md: '1.25rem' },
          lineHeight: 1.6
        }}
      >
        Get real-time insights, predictions, and comprehensive analysis 
        for your investment decisions
      </Typography>

      {/* Action Buttons */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/stocks"
          endIcon={<ArrowForward />}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            minWidth: { xs: '100%', sm: 200 }
          }}
        >
          View Stocks
        </Button>

        <Button
          variant="outlined"
          size="large"
          startIcon={<Analytics />}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
            minWidth: { xs: '100%', sm: 200 }
          }}
        >
          Learn More
        </Button>
      </Stack>
    </Box>
  )
}