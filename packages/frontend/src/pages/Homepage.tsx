import { Box, Stack } from '@mui/material'
import { HeroSection } from '../components/homepage/HeroSection'
import { NewsSummary } from '../components/homepage/NewsSummary'
import { MicroCharts } from '../components/homepage/MicroCharts'

export function Homepage() {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack spacing={3}>
        {/* Hero Section - Full Width */}
        <HeroSection />

        {/* Content Grid - News and Charts */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
            gap: 3
          }}
        >
          <NewsSummary />
          <MicroCharts />
        </Box>
      </Stack>
    </Box>
  )
}