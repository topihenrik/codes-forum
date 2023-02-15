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
  },
});

export default theme;
