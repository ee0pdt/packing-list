import { SxProps, Theme } from '@mui/material/styles';

/**
 * Glassmorphism Utility Functions
 *
 * Creates molten glass effects with frosted blur, transparency, and borders
 */

export interface GlassOptions {
  blur?: number;
  opacity?: number;
  borderOpacity?: number;
  saturation?: number;
  brightness?: number;
}

/**
 * Core glassmorphism effect
 * Creates a frosted glass appearance with backdrop blur
 */
export const glassEffect = (options: GlassOptions = {}): SxProps<Theme> => {
  const {
    blur = 20,
    opacity = 0.1,
    borderOpacity = 0.18,
    saturation = 180,
    brightness = 120,
  } = options;

  return {
    background: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px) saturate(${saturation}%) brightness(${brightness}%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%) brightness(${brightness}%)`,
    border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
    boxShadow: `
      0 8px 32px 0 rgba(31, 38, 135, 0.15),
      inset 0 1px 1px 0 rgba(255, 255, 255, 0.4)
    `,
  };
};

/**
 * Enhanced glass effect for prominent surfaces
 */
export const glassEffectStrong: SxProps<Theme> = {
  ...glassEffect({ opacity: 0.15, blur: 25, borderOpacity: 0.25 }),
  boxShadow: `
    0 8px 32px 0 rgba(31, 38, 135, 0.25),
    inset 0 1px 2px 0 rgba(255, 255, 255, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1)
  `,
};

/**
 * Subtle glass effect for nested elements
 */
export const glassEffectSubtle: SxProps<Theme> = glassEffect({
  opacity: 0.05,
  blur: 15,
  borderOpacity: 0.1,
});

/**
 * Liquid glass hover effect
 * Smooth transition with enhanced glass properties
 */
export const glassHoverEffect: SxProps<Theme> = {
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(30px) saturate(200%) brightness(130%)',
    WebkitBackdropFilter: 'blur(30px) saturate(200%) brightness(130%)',
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: `
      0 12px 40px 0 rgba(31, 38, 135, 0.3),
      inset 0 1px 3px 0 rgba(255, 255, 255, 0.6),
      0 0 0 1px rgba(255, 255, 255, 0.2)
    `,
  },
};

/**
 * Jelly/elastic press effect
 * Spring-like animation on click/touch
 */
export const jellyPressEffect: SxProps<Theme> = {
  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  '&:active': {
    transform: 'scale(0.95)',
    transition: 'transform 0.1s ease-out',
  },
};

/**
 * Liquid morphing transition
 * Smooth, flowing animation for state changes
 */
export const liquidMorphTransition: SxProps<Theme> = {
  transition: 'all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
};

/**
 * Shimmer overlay for liquid glass effect
 */
export const shimmerOverlay: SxProps<Theme> = {
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
    animation: 'shimmer 3s infinite',
    pointerEvents: 'none',
  },
  '@keyframes shimmer': {
    '0%': {
      left: '-100%',
    },
    '100%': {
      left: '200%',
    },
  },
};

/**
 * Glass card with full effects
 * Ready-to-use glass card styling
 */
export const glassCard: SxProps<Theme> = {
  ...glassEffect(),
  ...glassHoverEffect,
  ...jellyPressEffect,
  borderRadius: '20px',
  padding: 3,
};

/**
 * Combine multiple glass effects
 */
export const combineGlassEffects = (...effects: SxProps<Theme>[]): SxProps<Theme> => {
  return effects.reduce((acc, effect) => ({ ...acc, ...effect }), {});
};
