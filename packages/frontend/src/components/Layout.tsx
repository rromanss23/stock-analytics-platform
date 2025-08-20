import React from 'react'
import { Box, Container } from '@mui/material'
import { Navigation } from './Navigation'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />
      <Container 
        maxWidth="xl" 
        component="main"
        sx={{ 
          flexGrow: 1,
          py: 3,
          px: { xs: 2, sm: 3 }
        }}
      >
        {children}
      </Container>
    </Box>
  )
}