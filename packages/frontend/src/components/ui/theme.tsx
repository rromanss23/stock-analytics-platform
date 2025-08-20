import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00D4FF', // Electric blue
      light: '#4DE6FF',
      dark: '#0099CC',
      contrastText: '#000000',
    },
    secondary: {
      main: '#0080FF', // Complementary electric blue
      light: '#4D9FFF',
      dark: '#0066CC',
    },
    background: {
      default: '#0A0E1A', // Very dark blue-black
      paper: '#1A1F2E',   // Slightly lighter for cards/surfaces
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0BEC5',
    },
    divider: '#2C3E50',
    // Financial-specific colors
    success: {
      main: '#00FF88',    // Electric green for gains
      dark: '#00CC6A',
    },
    error: {
      main: '#FF3366',    // Electric red for losses
      dark: '#CC1A4D',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0A0E1A',
          backgroundImage: 'linear-gradient(135deg, #0A0E1A 0%, #1A1F2E 100%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1A1F2E',
          border: '1px solid rgba(0, 212, 255, 0.1)',
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1F2E',
          '& .MuiTableCell-head': {
            backgroundColor: '#242938',
            color: '#00D4FF',
            fontWeight: 600,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: 'linear-gradient(45deg, #00D4FF 30%, #0080FF 90%)',
          boxShadow: '0 3px 15px 2px rgba(0, 212, 255, 0.3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #4DE6FF 30%, #4D9FFF 90%)',
            boxShadow: '0 5px 20px 4px rgba(0, 212, 255, 0.4)',
          },
        },
      },
    },
  },
});

export default darkTheme;