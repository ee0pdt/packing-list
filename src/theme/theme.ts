import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import { green, amber, blue } from "@mui/material/colors";

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

const baseTheme = createTheme({
  palette: {
    // Traditional MUI colours
    primary: {
      main: blue[700],
      light: blue[500],
      dark: blue[900],
    },
    success: {
      main: green[500],
      light: green[300],
      dark: green[700],
    },
  },

  // Additional theme customisations
  shape: {
    borderRadius: 8, // Consistent, slightly rounded corners
  },

  // Typography adjustments for UK English
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),

    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
    },
  },

  // Responsive font sizes for better accessibility
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // More readable, less shouty
        },
      },
    },
  },
});

// Create a responsive theme with increased font sizes
const theme = responsiveFontSizes(baseTheme);

export default theme;
