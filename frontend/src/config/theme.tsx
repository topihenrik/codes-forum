import { createTheme } from '@mui/material';

const theme = createTheme({
  typography: {
    fontSize: 16,
  },
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          height: '32px',
          width: '32px',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: '#FFFFFF',
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      light: '#4f976d',
      main: '#186436',
      dark: '#084620',
    },
    secondary: {
      light: '#191919',
      main: '#141414',
      dark: '#080808',
    },
    info: {
      light: '#af2a6c',
      main: '#960050',
      dark: '#6d0242',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
    },
  },
});

export default theme;
