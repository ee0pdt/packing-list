import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            textDecoration: 'line-through',
            color: 'rgba(0, 0, 0, 0.38)',
          },
        },
      },
    },
  },
});