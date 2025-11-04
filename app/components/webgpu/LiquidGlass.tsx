import tgpu from 'typegpu';
import * as d from 'typegpu/data';

// Uniforms structure for passing data to shaders
const Uniforms = d.struct({
  time: d.f32,
  mouseX: d.f32,
  mouseY: d.f32,
  intensity: d.f32,
  resolution: d.vec2f,
});

// Morphing blob function - creates liquid distortion using TypeScript
const morphingBlob = tgpu.fn([d.vec2f, d.f32], d.vec2f).does((uv, time) => {
  'use gpu';

  // Multiple sine waves create organic morphing
  const freq1 = Math.sin(time * 1.2 + uv.y * 8.0) * Math.cos(time * 0.8 + uv.x * 6.0);
  const freq2 = Math.cos(time * 1.5 + uv.x * 10.0) * Math.sin(time * 1.1 + uv.y * 7.0);
  const center = d.vec2f(0.5, 0.5);
  const dist = Math.sqrt((uv.x - center.x) * (uv.x - center.x) + (uv.y - center.y) * (uv.y - center.y));
  const freq3 = Math.sin(time * 0.9 + dist * 12.0);

  const distortion = (freq1 + freq2 * 0.5 + freq3 * 0.3) * 0.015;
  return d.vec2f(distortion, distortion * 0.8);
});

// Glass refraction - simulates light bending through glass
const glassRefraction = tgpu.fn([d.vec2f, d.vec2f, d.f32], d.vec2f).does((uv, normal, strength) => {
  'use gpu';

  const ior = 1.5; // Index of refraction for glass
  const refractAmount = (1.0 / ior) * strength;
  return d.vec2f(
    uv.x + normal.x * refractAmount,
    uv.y + normal.y * refractAmount
  );
});

// Calculate distance from point to point
const distance2d = tgpu.fn([d.vec2f, d.vec2f], d.f32).does((a, b) => {
  'use gpu';
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
});

// Clamp function
const clamp = tgpu.fn([d.f32, d.f32, d.f32], d.f32).does((value, min, max) => {
  'use gpu';
  return Math.max(min, Math.min(value, max));
});

// Smoothstep function for smooth interpolation
const smoothstep = tgpu.fn([d.f32, d.f32, d.f32], d.f32).does((edge0, edge1, x) => {
  'use gpu';
  const t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
});

export async function initLiquidGlass(canvas: HTMLCanvasElement) {
  try {
    // Check for WebGPU support
    if (!navigator.gpu) {
      console.warn('WebGPU not supported in this browser');
      return;
    }

    // Initialize TypeGPU root
    const root = await tgpu.init();
    const device = root.device;
    const context = canvas.getContext('webgpu');

    if (!context) {
      console.error('Could not get WebGPU context');
      return;
    }

    // Configure canvas
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
      device,
      format: presentationFormat,
      alphaMode: 'premultiplied',
    });

    // Create uniform buffer
    const uniformBuffer = root.createBuffer(Uniforms, {
      time: 0,
      mouseX: 0.5,
      mouseY: 0.5,
      intensity: 0.8,
      resolution: d.vec2f(canvas.width, canvas.height),
    }).$usage('uniform');

    // Create texture for background sampling
    const bgTexture = device.createTexture({
      size: [canvas.width, canvas.height],
      format: presentationFormat,
      usage: GPUTextureUsage.TEXTURE_BINDING |
             GPUTextureUsage.COPY_DST |
             GPUTextureUsage.RENDER_ATTACHMENT,
    });

    const bgSampler = device.createSampler({
      magFilter: 'linear',
      minFilter: 'linear',
      addressModeU: 'clamp-to-edge',
      addressModeV: 'clamp-to-edge',
    });

    // Vertex shader - creates fullscreen quad
    const vertexShader = tgpu['~unstable'].vertexFn([], d.vec4f)
      .does(({ vertexIndex }) => {
        'use gpu';

        // Create fullscreen triangle
        const x = (vertexIndex === 1) ? 3.0 : -1.0;
        const y = (vertexIndex === 2) ? -3.0 : 1.0;

        return d.vec4f(x, y, 0.0, 1.0);
      })
      .with({ builtin: 'position' });

    // Fragment shader - applies refraction effect
    const fragmentShader = tgpu['~unstable'].fragmentFn([d.vec4f], d.vec4f)
      .does(({ position }, { uniforms }) => {
        'use gpu';

        // Normalize coordinates
        const uv = d.vec2f(
          position.x / uniforms.resolution.x,
          position.y / uniforms.resolution.y
        );

        const time = uniforms.time;
        const center = d.vec2f(0.5, 0.5);

        // Apply morphing distortion
        const morph = morphingBlob(uv, time);
        const distortedUV = d.vec2f(uv.x + morph.x, uv.y + morph.y);

        // Calculate distance from center for bubble effect
        const toCenter = d.vec2f(distortedUV.x - center.x, distortedUV.y - center.y);
        const dist = distance2d(distortedUV, center);

        // Create multiple bubbles
        const bubbleStrength = smoothstep(0.5, 0.0, dist) * uniforms.intensity;

        // Mouse interaction ripple
        const mousePos = d.vec2f(uniforms.mouseX, uniforms.mouseY);
        const mouseDist = distance2d(uv, mousePos);
        const ripple = Math.sin((mouseDist - time * 0.5) * 20.0) *
                      Math.exp(-mouseDist * 3.0) * 0.05;

        // Normal for refraction
        const refractNormal = d.vec2f(
          toCenter.x / (dist + 0.001),
          toCenter.y / (dist + 0.001)
        );

        // Apply glass refraction
        const refractedUV = glassRefraction(uv, refractNormal, bubbleStrength + ripple);

        // Clamp UV coordinates
        const finalUV = d.vec2f(
          clamp(refractedUV.x, 0.0, 1.0),
          clamp(refractedUV.y, 0.0, 1.0)
        );

        // Sample background with refracted coordinates
        // For now, create a gradient background
        const bgColor = d.vec3f(
          0.5 + 0.5 * Math.sin(finalUV.x * 3.14159),
          0.5 + 0.5 * Math.sin(finalUV.y * 3.14159 + 2.0),
          0.5 + 0.5 * Math.sin((finalUV.x + finalUV.y) * 3.14159 + 4.0)
        );

        // Fresnel edge highlights
        const viewDir = d.vec3f(toCenter.x, toCenter.y, 0.0);
        const normal3d = d.vec3f(0.0, 0.0, 1.0);
        const dotProduct = Math.abs(
          viewDir.x * normal3d.x +
          viewDir.y * normal3d.y +
          viewDir.z * normal3d.z
        );
        const fresnel = Math.pow(1.0 - dotProduct, 3.0);

        const edgeHighlight = d.vec3f(1.0, 1.0, 1.0);
        const highlightStrength = fresnel * 0.4 * bubbleStrength;

        // Combine refracted color with highlights and glass tint
        const glassTint = d.vec3f(0.95, 0.97, 1.0);
        const finalColor = d.vec3f(
          bgColor.x * glassTint.x + edgeHighlight.x * highlightStrength,
          bgColor.y * glassTint.y + edgeHighlight.y * highlightStrength,
          bgColor.z * glassTint.z + edgeHighlight.z * highlightStrength
        );

        // Alpha based on bubble strength
        const alpha = 0.2 + bubbleStrength * 0.6;

        return d.vec4f(finalColor.x, finalColor.y, finalColor.z, alpha);
      })
      .with({ builtin: 'position' })
      .outputs({ location: 0 });

    // Create render pipeline (note: TypeGPU's render pipeline API is still being developed)
    // For now, we'll need to use the underlying WebGPU device directly for the pipeline
    // This is a temporary approach until TypeGPU's render pipeline API is more complete

    // Mouse tracking
    let mouseX = 0.5;
    let mouseY = 0.5;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - (e.clientY / window.innerHeight);
    });

    // Animation loop
    let startTime = Date.now();

    function render() {
      const currentTime = (Date.now() - startTime) / 1000.0;

      // Update uniforms
      uniformBuffer.write({
        time: currentTime,
        mouseX,
        mouseY,
        intensity: 0.8,
        resolution: d.vec2f(canvas.width, canvas.height),
      });

      // TODO: Render pass using TypeGPU's render pipeline
      // This will be implemented once we have the full pipeline setup

      requestAnimationFrame(render);
    }

    render();

    // Handle resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Reconfigure context
      context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'premultiplied',
      });
    });

  } catch (error) {
    console.error('Failed to initialize TypeGPU liquid glass:', error);
  }
}
