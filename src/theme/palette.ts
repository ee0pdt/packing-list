import { PaletteOptions } from '@mui/material/styles';

// Molten Glass Color Palette
// Inspired by liquid glass, translucent surfaces, and flowing gradients

// Extend the default palette with custom colours
declare module "@mui/material/styles" {
  interface Palette {
    status: {
      complete: string;
      inProgress: string;
    };
    glass: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      overlay: string;
    };
    gradient: {
      primary: string;
      secondary: string;
      accent: string;
      shimmer: string;
    };
  }

  interface PaletteOptions {
    status?: {
      complete?: string;
      inProgress?: string;
    };
    glass?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
      surface?: string;
      overlay?: string;
    };
    gradient?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      shimmer?: string;
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
  // Vibrant glass-inspired primary colors with transparency
  primary: {
    main: 'rgba(99, 102, 241, 0.95)', // Indigo with slight transparency
    light: 'rgba(129, 140, 248, 0.9)',
    dark: 'rgba(67, 56, 202, 1)',
    contrastText: '#ffffff',
  },
  secondary: {
    main: 'rgba(236, 72, 153, 0.95)', // Pink/Magenta
    light: 'rgba(249, 168, 212, 0.9)',
    dark: 'rgba(219, 39, 119, 1)',
    contrastText: '#ffffff',
  },
  success: {
    main: 'rgba(16, 185, 129, 0.95)', // Emerald
    light: 'rgba(110, 231, 183, 0.9)',
    dark: 'rgba(5, 150, 105, 1)',
  },
  info: {
    main: 'rgba(59, 130, 246, 0.95)', // Sky blue
    light: 'rgba(147, 197, 253, 0.9)',
    dark: 'rgba(29, 78, 216, 1)',
  },
  background: {
    default: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    paper: 'rgba(255, 255, 255, 0.05)',
  },
  // Custom glass colors for glassmorphism effects
  glass: {
    primary: 'rgba(255, 255, 255, 0.1)',
    secondary: 'rgba(255, 255, 255, 0.05)',
    accent: 'rgba(255, 255, 255, 0.2)',
    background: 'rgba(255, 255, 255, 0.03)',
    surface: 'rgba(255, 255, 255, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.2)',
  },
  // Gradient definitions for liquid effects
  gradient: {
    primary: 'linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',
    secondary: 'linear-gradient(135deg, rgba(236, 72, 153, 0.8) 0%, rgba(251, 113, 133, 0.8) 100%)',
    accent: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(147, 51, 234, 0.8) 100%)',
    shimmer: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
  },
};