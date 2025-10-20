import { PaletteOptions } from '@mui/material/styles';
import { green, blue } from '@mui/material/colors';

// Extend the default palette with custom colours
declare module "@mui/material/styles" {
  interface Palette {
    status: {
      complete: string;
      inProgress: string;
    };
  }

  interface PaletteOptions {
    status?: {
      complete?: string;
      inProgress?: string;
    };
  }
}

// Optional: Extend components with custom colour types if needed
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    status: true;
  }
}

export const palette: PaletteOptions = {
  primary: {
    main: blue[700],
    light: blue[500],
    dark: blue[900],
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#fff',
  },
  success: {
    main: green[500],
    light: green[50],
    dark: green[700],
  },
  info: {
    main: blue[500],
    light: blue[50],
    dark: blue[700],
  },
  background: {
    default: '#f5f5f5',
    paper: '#fff',
  },
};