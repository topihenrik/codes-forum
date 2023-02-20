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
    primary: { // https://m2.material.io/inline-tools/color/ #002D08
      main: '#186436',
      light: '#4f976d',
      dark: '#084620',
    },
    info: {
      main: '#960050',
      light: '#af2a6c',
      dark: '#6d0242',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
    },
  },
});

export default theme;
