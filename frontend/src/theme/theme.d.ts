import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface CustomPalette {
    userMessage: {
      background: string;
      text: string;
    };
    botMessage: {
      background: string;
      text: string;
    };
  }

  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

// Update the createTheme function to include custom properties
declare module '@mui/material/styles' {
  interface Theme {
    customShadows?: {
      button?: string;
      card?: string;
      dialog?: string;
    };
  }
  
  interface ThemeOptions {
    customShadows?: {
      button?: string;
      card?: string;
      dialog?: string;
    };
  }
}
