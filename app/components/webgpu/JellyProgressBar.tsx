import type { Remix } from "@remix-run/dom";
import tgpu from 'typegpu';
import * as d from 'typegpu/data';
import * as std from 'typegpu/std';

interface JellyProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

export function JellyProgressBar(this: Remix.Handle, { progress, className = '' }: JellyProgressBarProps) {
  let canvas: HTMLCanvasElement | null = null;
  let animationId: number | null = null;
  let progressValue = progress;

  const initWebGPU = async (canvasElement: HTMLCanvasElement) => {
    try {
      if (!navigator.gpu) {
        console.warn('[JellyProgressBar] WebGPU not supported');
        return null;
      }

      // Initialize TypeGPU
      const root = await tgpu.init();
      const device = root.device;

      const context = canvasElement.getContext('webgpu');
      if (!context) return null;

      const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
      context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'premultiplied',
      });

      // Uniforms for animation and state
      const Uniforms = d.struct({
        time: d.f32,
        progress: d.f32, // 0.0 to 1.0
        resolution: d.vec2f,
      });

      const uniformBuffer = root.createBuffer(Uniforms, {
        time: 0,
        progress: progressValue / 100,
        resolution: d.vec2f(canvasElement.width, canvasElement.height),
      }).$usage('uniform');

      // Vertex shader
      const vertexShader = tgpu['~unstable'].vertexFn([], d.vec4f)
        .does(({ vertexIndex }) => {
          'use gpu';
          const x = (vertexIndex === 1) ? 3.0 : -1.0;
          const y = (vertexIndex === 2) ? -3.0 : 1.0;
          return d.vec4f(x, y, 0.0, 1.0);
        })
        .with({ builtin: 'position' });

      // Fragment shader with jelly sparkle effect
      const fragmentShader = tgpu['~unstable'].fragmentFn([d.vec4f], d.vec4f)
        .does(({ position }, { uniforms }) => {
          'use gpu';

          // Normalize coordinates
          const uv = d.vec2f(
            position.x / uniforms.resolution.x,
            position.y / uniforms.resolution.y
          );

          const time = uniforms.time;
          const progress = uniforms.progress;

          // Jelly wobble effect - multiple sine waves
          const wobbleFreq1 = std.sin(time * 2.0 + uv.x * 8.0) * 0.015;
          const wobbleFreq2 = std.sin(time * 3.0 + uv.x * 12.0 + 2.0) * 0.01;
          const wobbleFreq3 = std.cos(time * 4.0 + uv.x * 16.0 + 4.0) * 0.008;

          const totalWobble = wobbleFreq1 + wobbleFreq2 + wobbleFreq3;

          // Add vertical wobble at the progress edge
          const edgeDist = std.abs(uv.x - progress);
          const edgeWobble = std.sin(time * 5.0 + uv.y * 20.0) *
                            std.exp(-edgeDist * 10.0) * 0.02;

          const wobbledY = uv.y + totalWobble + edgeWobble;

          // Check if we're inside the progress bar (with wobble)
          const isInside = uv.x < (progress + totalWobble);

          // Sparkle effect - multiple layers of moving sparkles
          const sparkle1X = uv.x * 30.0 + time * 5.0;
          const sparkle1Y = wobbledY * 30.0 - time * 3.0;
          const sparkle1 = std.sin(sparkle1X) * std.cos(sparkle1Y);
          const sparkle1Intensity = std.smoothstep(0.85, 0.95, sparkle1);

          const sparkle2X = uv.x * 45.0 - time * 4.0;
          const sparkle2Y = wobbledY * 45.0 + time * 6.0;
          const sparkle2 = std.sin(sparkle2X + 1.5) * std.cos(sparkle2Y + 1.5);
          const sparkle2Intensity = std.smoothstep(0.88, 0.96, sparkle2);

          const sparkle3X = uv.x * 60.0 + time * 7.0;
          const sparkle3Y = wobbledY * 60.0 - time * 5.0;
          const sparkle3 = std.sin(sparkle3X + 3.0) * std.cos(sparkle3Y + 3.0);
          const sparkle3Intensity = std.smoothstep(0.90, 0.98, sparkle3);

          const totalSparkle = sparkle1Intensity * 0.6 +
                              sparkle2Intensity * 0.4 +
                              sparkle3Intensity * 0.8;

          // Animated gradient colors
          const colorShift = std.sin(time * 0.5) * 0.3;

          // Base gradient (blue -> purple -> pink)
          const gradientPos = uv.x / std.max(progress, 0.01);

          const color1 = d.vec3f(0.2 + colorShift, 0.4, 0.9); // Blue
          const color2 = d.vec3f(0.6, 0.3 + colorShift, 0.9); // Purple
          const color3 = d.vec3f(0.9, 0.3, 0.7 + colorShift); // Pink

          let baseColor: typeof d.vec3f;
          if (gradientPos < 0.5) {
            const t = gradientPos * 2.0;
            baseColor = d.vec3f(
              color1.x * (1.0 - t) + color2.x * t,
              color1.y * (1.0 - t) + color2.y * t,
              color1.z * (1.0 - t) + color2.z * t
            );
          } else {
            const t = (gradientPos - 0.5) * 2.0;
            baseColor = d.vec3f(
              color2.x * (1.0 - t) + color3.x * t,
              color2.y * (1.0 - t) + color3.y * t,
              color2.z * (1.0 - t) + color3.z * t
            );
          }

          // Add sparkle highlights
          const sparkleColor = d.vec3f(1.0, 1.0, 1.0);
          const finalColor = d.vec3f(
            std.clamp(baseColor.x + sparkleColor.x * totalSparkle, 0.0, 1.0),
            std.clamp(baseColor.y + sparkleColor.y * totalSparkle, 0.0, 1.0),
            std.clamp(baseColor.z + sparkleColor.z * totalSparkle, 0.0, 1.0)
          );

          // Jelly glass refraction at edges
          const centerDist = std.abs(wobbledY - 0.5);
          const edgeGlow = std.smoothstep(0.5, 0.3, centerDist) * 0.3;

          const glowColor = d.vec3f(
            finalColor.x + edgeGlow,
            finalColor.y + edgeGlow,
            finalColor.z + edgeGlow
          );

          // Subtle inner shadow for depth
          const innerShadow = std.smoothstep(0.0, 0.1, wobbledY) *
                             std.smoothstep(1.0, 0.9, wobbledY) * 0.2;

          const shadowedColor = d.vec3f(
            glowColor.x * (1.0 - innerShadow),
            glowColor.y * (1.0 - innerShadow),
            glowColor.z * (1.0 - innerShadow)
          );

          // Progress bar with smooth fade at edges
          const alpha = isInside ? 0.95 : 0.0;

          // Add glow at the progress edge
          const progressEdgeGlow = std.smoothstep(0.05, 0.0, edgeDist) * 0.8;
          const finalAlpha = std.clamp(alpha + progressEdgeGlow, 0.0, 1.0);

          return d.vec4f(
            shadowedColor.x,
            shadowedColor.y,
            shadowedColor.z,
            finalAlpha
          );
        })
        .with({ builtin: 'position' })
        .outputs({ location: 0 });

      // Create render pipeline
      const pipeline = root['~unstable'].createGuardedRenderPipeline({
        vertex: vertexShader,
        fragment: fragmentShader,
        primitive: {
          topology: 'triangle-list',
        },
        targets: [{
          format: presentationFormat,
          blend: {
            color: {
              srcFactor: 'src-alpha',
              dstFactor: 'one-minus-src-alpha',
              operation: 'add',
            },
            alpha: {
              srcFactor: 'one',
              dstFactor: 'one-minus-src-alpha',
              operation: 'add',
            },
          },
        }],
      });

      // Animation loop
      const startTime = Date.now();

      const render = () => {
        const currentTime = (Date.now() - startTime) / 1000.0;

        // Update uniforms
        uniformBuffer.write({
          time: currentTime,
          progress: progressValue / 100,
          resolution: d.vec2f(canvasElement.width, canvasElement.height),
        });

        // Get texture view
        const textureView = context.getCurrentTexture().createView();

        // Create command encoder
        const commandEncoder = device.createCommandEncoder();

        // Render pass
        const renderPass = commandEncoder.beginRenderPass({
          colorAttachments: [{
            view: textureView,
            clearValue: { r: 0, g: 0, b: 0, a: 0 },
            loadOp: 'clear',
            storeOp: 'store',
          }],
        });

        // Execute pipeline
        pipeline.execute(renderPass, {
          uniforms: uniformBuffer,
        });

        renderPass.end();

        // Submit
        device.queue.submit([commandEncoder.finish()]);

        animationId = requestAnimationFrame(render);
      };

      render();

      return {
        cleanup: () => {
          if (animationId) cancelAnimationFrame(animationId);
        }
      };

    } catch (error) {
      console.error('[JellyProgressBar] Failed to initialize:', error);
      return null;
    }
  };

  // Canvas mounted callback
  const onCanvasMount = (element: HTMLCanvasElement) => {
    canvas = element;

    // Set canvas size
    const updateSize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    updateSize();

    // Initialize WebGPU
    initWebGPU(canvas);

    // Handle resize
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(canvas);

    // Cleanup on unmount
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  };

  return () => (
    <canvas
      ref={onCanvasMount}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
