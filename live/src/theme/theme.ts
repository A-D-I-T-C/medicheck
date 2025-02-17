import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1a1a1a',
      paper: '#242424',
    },
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#64748b',
    },
    error: {
      main: '#ef4444',
      light: '#450a0a',
    },
    warning: {
      main: '#f59e0b',
      light: '#451a03',
    },
    success: {
      main: '#22c55e',
      light: '#052e16',
    },
    text: {
      primary: '#e2e8f0',
      secondary: '#94a3b8',
    },
  },
  components: {
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          backgroundColor: '#242424',
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: false,
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          '&:last-child': {
            paddingBottom: '12px',
          },
        },
      },
    },
  },
});
