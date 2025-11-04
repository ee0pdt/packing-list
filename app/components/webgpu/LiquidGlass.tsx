import tgpu from 'typegpu';
import * as d from 'typegpu/data';
import * as std from 'typegpu/std';

export async function initLiquidGlass(canvas: HTMLCanvasElement) {
  try {
    console.log('[LiquidGlass] Initializing...');

    // Check for WebGPU support
    if (!navigator.gpu) {
      console.warn('[LiquidGlass] WebGPU not supported in this browser');
      return;
    }

    // Initialize TypeGPU root
    console.log('[LiquidGlass] Requesting GPU adapter...');
    const root = await tgpu.init();
    const device = root.device;
    console.log('[LiquidGlass] GPU device initialized');

    const context = canvas.getContext('webgpu');

    if (!context) {
      console.error('[LiquidGlass] Could not get WebGPU context');
      return;
    }

    // Configure canvas
    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
      device,
      format: presentationFormat,
      alphaMode: 'premultiplied',
    });

    console.log('[LiquidGlass] Canvas configured with format:', presentationFormat);

    // Create uniforms structure
    const Uniforms = d.struct({
      time: d.f32,
      resolution: d.vec2f,
      mouse: d.vec2f,
    });

    // Create uniform buffer
    const uniformBuffer = root.createBuffer(Uniforms, {
      time: 0,
      resolution: d.vec2f(canvas.width, canvas.height),
      mouse: d.vec2f(0.5, 0.5),
    }).$usage('uniform');

    console.log('[LiquidGlass] Uniform buffer created');

    // Create simple vertex shader for fullscreen quad
    const vertexShader = tgpu['~unstable'].vertexFn([], d.vec4f)
      .does(({ vertexIndex }) => {
        'use gpu';
        // Fullscreen triangle vertices
        const x = (vertexIndex === 1) ? 3.0 : -1.0;
        const y = (vertexIndex === 2) ? -3.0 : 1.0;
        return d.vec4f(x, y, 0.0, 1.0);
      })
      .with({ builtin: 'position' });

    // Create fragment shader with liquid glass effect
    const fragmentShader = tgpu['~unstable'].fragmentFn([d.vec4f], d.vec4f)
      .does(({ position }, { uniforms }) => {
        'use gpu';

        // Normalize UV coordinates
        const uv = d.vec2f(
          position.x / uniforms.resolution.x,
          position.y / uniforms.resolution.y
        );

        const time = uniforms.time;
        const center = d.vec2f(0.5, 0.5);

        // Calculate distance from center
        const dx = uv.x - center.x;
        const dy = uv.y - center.y;
        const dist = std.sqrt(dx * dx + dy * dy);

        // Create morphing distortion
        const freq1 = std.sin(time * 1.2 + uv.y * 8.0) * std.cos(time * 0.8 + uv.x * 6.0);
        const freq2 = std.cos(time * 1.5 + uv.x * 10.0) * std.sin(time * 1.1 + uv.y * 7.0);
        const freq3 = std.sin(time * 0.9 + dist * 12.0);

        const distortion = (freq1 + freq2 * 0.5 + freq3 * 0.3) * 0.015;

        // Apply distortion to UV
        const distortedUV = d.vec2f(
          uv.x + distortion,
          uv.y + distortion * 0.8
        );

        // Mouse interaction
        const mouseDx = uv.x - uniforms.mouse.x;
        const mouseDy = uv.y - uniforms.mouse.y;
        const mouseDist = std.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
        const ripple = std.sin((mouseDist - time * 0.5) * 20.0) * std.exp(-mouseDist * 3.0) * 0.05;

        // Glass refraction effect
        const ior = 1.5;
        const refractStrength = std.smoothstep(0.5, 0.0, dist) * 0.8;
        const refractAmount = (1.0 / ior) * (refractStrength + ripple);

        const normal = d.vec2f(dx / (dist + 0.001), dy / (dist + 0.001));
        const refractedUV = d.vec2f(
          std.clamp(distortedUV.x + normal.x * refractAmount, 0.0, 1.0),
          std.clamp(distortedUV.y + normal.y * refractAmount, 0.0, 1.0)
        );

        // Create gradient background
        const bgColor = d.vec3f(
          0.5 + 0.5 * std.sin(refractedUV.x * 3.14159),
          0.5 + 0.5 * std.sin(refractedUV.y * 3.14159 + 2.0),
          0.5 + 0.5 * std.sin((refractedUV.x + refractedUV.y) * 3.14159 + 4.0)
        );

        // Fresnel edge highlights
        const fresnel = std.pow(1.0 - std.abs(dx * dx + dy * dy), 3.0);
        const highlight = fresnel * 0.4 * refractStrength;

        // Glass tint
        const glassTint = d.vec3f(0.95, 0.97, 1.0);
        const finalColor = d.vec3f(
          bgColor.x * glassTint.x + highlight,
          bgColor.y * glassTint.y + highlight,
          bgColor.z * glassTint.z + highlight
        );

        // Alpha with bubble effect
        const alpha = 0.2 + refractStrength * 0.6;

        return d.vec4f(finalColor.x, finalColor.y, finalColor.z, alpha);
      })
      .with({ builtin: 'position' })
      .outputs({ location: 0 });

    console.log('[LiquidGlass] Shaders created');

    // Create render pipeline using TypeGPU's guarded pipeline
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

    console.log('[LiquidGlass] Render pipeline created');

    // Mouse tracking
    let mouseX = 0.5;
    let mouseY = 0.5;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = 1.0 - (e.clientY / window.innerHeight);
    });

    // Animation loop
    const startTime = Date.now();

    function render() {
      try {
        const currentTime = (Date.now() - startTime) / 1000.0;

        // Update uniforms
        uniformBuffer.write({
          time: currentTime,
          resolution: d.vec2f(canvas.width, canvas.height),
          mouse: d.vec2f(mouseX, mouseY),
        });

        // Get current texture view
        const textureView = context.getCurrentTexture().createView();

        // Create command encoder
        const commandEncoder = device.createCommandEncoder();

        // Create render pass
        const renderPass = commandEncoder.beginRenderPass({
          colorAttachments: [{
            view: textureView,
            clearValue: { r: 0, g: 0, b: 0, a: 0 },
            loadOp: 'clear',
            storeOp: 'store',
          }],
        });

        // Render with pipeline
        pipeline.execute(renderPass, {
          uniforms: uniformBuffer,
        });

        renderPass.end();

        // Submit commands
        device.queue.submit([commandEncoder.finish()]);

        requestAnimationFrame(render);
      } catch (err) {
        console.error('[LiquidGlass] Render error:', err);
      }
    }

    console.log('[LiquidGlass] Starting render loop');
    render();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      context.configure({
        device,
        format: presentationFormat,
        alphaMode: 'premultiplied',
      });
    };

    window.addEventListener('resize', handleResize);

    console.log('[LiquidGlass] Initialization complete!');

  } catch (error) {
    console.error('[LiquidGlass] Initialization failed:', error);
    throw error;
  }
}
