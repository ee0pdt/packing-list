import { keyframes } from '@mui/material/styles';

// Original strikethrough animations (preserved for compatibility)
export const strikethrough = keyframes`
  from {
    text-decoration-color: transparent;
    text-decoration-thickness: 0;
  }
  to {
    text-decoration-color: rgba(255, 255, 255, 0.6);
    text-decoration-thickness: 0.2rem;
  }
`;

export const unstrike = keyframes`
  from {
    text-decoration-color: rgba(255, 255, 255, 0.6);
    text-decoration-thickness: 0.2rem;
  }
  to {
    text-decoration-color: transparent;
    text-decoration-thickness: 0;
  }
`;

// Molten Glass Fluid Animations

/**
 * Jelly bounce - elastic spring effect
 */
export const jellyBounce = keyframes`
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.15, 0.85);
  }
  50% {
    transform: scale(0.95, 1.05);
  }
  75% {
    transform: scale(1.05, 0.95);
  }
  100% {
    transform: scale(1);
  }
`;

/**
 * Liquid float - smooth up/down movement
 */
export const liquidFloat = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

/**
 * Glass shimmer - light reflection moving across surface
 */
export const glassShimmer = keyframes`
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
`;

/**
 * Morph in - liquid entrance effect
 */
export const morphIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
    filter: blur(10px);
  }
  60% {
    transform: scale(1.05) translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
`;

/**
 * Morph out - liquid exit effect
 */
export const morphOut = keyframes`
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
    filter: blur(10px);
  }
`;

/**
 * Ripple pulse - expanding wave effect
 */
export const ripplePulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
  }
`;

/**
 * Liquid gradient shift - animated gradient background
 */
export const liquidGradient = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

/**
 * Wobble - jelly wiggle effect
 */
export const wobble = keyframes`
  0%, 100% {
    transform: translateX(0%) rotate(0deg);
  }
  15% {
    transform: translateX(-5px) rotate(-2deg);
  }
  30% {
    transform: translateX(4px) rotate(2deg);
  }
  45% {
    transform: translateX(-3px) rotate(-1deg);
  }
  60% {
    transform: translateX(2px) rotate(1deg);
  }
  75% {
    transform: translateX(-1px) rotate(-0.5deg);
  }
`;

/**
 * Glow pulse - pulsating light effect
 */
export const glowPulse = keyframes`
  0%, 100% {
    box-shadow:
      0 0 20px rgba(255, 255, 255, 0.2),
      inset 0 0 20px rgba(255, 255, 255, 0.1);
  }
  50% {
    box-shadow:
      0 0 40px rgba(255, 255, 255, 0.4),
      inset 0 0 30px rgba(255, 255, 255, 0.2);
  }
`;

/**
 * Elastic scale - spring-loaded scale animation
 */
export const elasticScale = keyframes`
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
  }
`;

/**
 * Wave - flowing wave motion
 */
export const wave = keyframes`
  0% {
    transform: translateX(0) translateY(0) scaleY(1);
  }
  25% {
    transform: translateX(-10px) translateY(-5px) scaleY(1.1);
  }
  50% {
    transform: translateX(0) translateY(0) scaleY(1);
  }
  75% {
    transform: translateX(10px) translateY(5px) scaleY(0.9);
  }
  100% {
    transform: translateX(0) translateY(0) scaleY(1);
  }
`;