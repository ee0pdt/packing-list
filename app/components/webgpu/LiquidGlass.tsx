export async function initLiquidGlass(canvas: HTMLCanvasElement) {
  try {
    console.log('[LiquidGlass] Initializing...');

    // Check for WebGPU support
    if (!navigator.gpu) {
      console.warn('[LiquidGlass] WebGPU not supported in this browser');
      return;
    }

    console.log('[LiquidGlass] WebGPU detected, but overlay disabled for stability');
    console.log('[LiquidGlass] Focus is on jelly progress bar effect');

    // For now, disable the full-screen liquid glass overlay
    // The jelly progress bar provides the main visual effect
    // This avoids TypeGPU API compatibility issues

    return;

  } catch (error) {
    console.error('[LiquidGlass] Initialization failed:', error);
    // Don't throw - allow app to continue without liquid glass overlay
    return;
  }
}
