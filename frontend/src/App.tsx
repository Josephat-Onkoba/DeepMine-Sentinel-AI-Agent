import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline, PaletteMode } from '@mui/material';
import ChatInterface from './components/ChatInterface';
import { deepPurple, pink } from '@mui/material/colors';
import './theme/theme.d.ts';

// Create a theme instance
const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    primary: {
      ...deepPurple,
      main: mode === 'dark' ? deepPurple[300] : deepPurple[700],
    },
    secondary: {
      ...pink,
      main: mode === 'dark' ? pink[300] : pink[600],
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#f8f9fa',
      paper: mode === 'dark' ? '#1e1e1e' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#e0e0e0' : '#212121',
      secondary: mode === 'dark' ? '#b0b0b0' : '#666666',
    },
    userMessage: {
      background: mode === 'dark' ? deepPurple[900] : deepPurple[100],
      text: mode === 'dark' ? '#ffffff' : deepPurple[900],
    },
    botMessage: {
      background: mode === 'dark' ? '#2d2d2d' : '#f0f0f0',
      text: mode === 'dark' ? '#e0e0e0' : '#212121',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h6: {
      fontWeight: 600,
    },
    body1: {
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        } as const,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          borderRadius: 8,
        } as const,
      },
    },
  },
});

function App() {
  const [mode, setMode] = useState<PaletteMode>('light');
  
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatInterface colorMode={colorMode} mode={mode} />
    </ThemeProvider>
  );
}

export default App;
