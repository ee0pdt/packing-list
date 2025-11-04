// WebGPU Liquid Glass with real refraction
// This creates a glass layer that refracts the content below it

const REFRACTION_SHADER_WGSL = `
struct Uniforms {
  time: f32,
  mouseX: f32,
  mouseY: f32,
  intensity: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var bgTexture: texture_2d<f32>;
@group(0) @binding(2) var bgSampler: sampler;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var pos = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f( 1.0, -1.0), vec2f(-1.0,  1.0),
    vec2f(-1.0,  1.0), vec2f( 1.0, -1.0), vec2f( 1.0,  1.0),
  );

  var output: VertexOutput;
  output.position = vec4f(pos[vertexIndex], 0.0, 1.0);
  output.uv = pos[vertexIndex] * 0.5 + 0.5;
  output.uv.y = 1.0 - output.uv.y; // Flip Y
  return output;
}

// Morphing blob function - creates liquid distortion
fn morphingBlob(uv: vec2f, time: f32) -> vec2f {
  // Multiple sine waves create organic morphing
  let freq1 = sin(time * 1.2 + uv.y * 8.0) * cos(time * 0.8 + uv.x * 6.0);
  let freq2 = cos(time * 1.5 + uv.x * 10.0) * sin(time * 1.1 + uv.y * 7.0);
  let freq3 = sin(time * 0.9 + length(uv - 0.5) * 12.0);

  let distortion = (freq1 + freq2 * 0.5 + freq3 * 0.3) * 0.015;

  return vec2f(distortion, distortion * 0.8);
}

// Glass refraction - simulates light bending
fn glassRefraction(uv: vec2f, normal: vec2f, strength: f32) -> vec2f {
  // Index of refraction for glass
  let ior = 1.5;
  let refractAmount = (1.0 / ior) * strength;

  return uv + normal * refractAmount;
}

@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4f {
  let uv = input.uv;
  let time = uniforms.time;
  let intensity = uniforms.intensity;

  // Calculate distance from mouse
  let mouse = vec2f(uniforms.mouseX, uniforms.mouseY);
  let distFromMouse = length(uv - mouse);

  // Morphing distortion
  let morph = morphingBlob(uv, time);

  // Calculate surface normal for refraction
  let center = vec2f(0.5, 0.5);
  let toCenter = normalize(uv - center);
  let dist = distance(uv, center);

  // Create glass bubble effect - stronger in center
  let bubbleStrength = smoothstep(0.8, 0.2, dist) * intensity;

  // Mouse interaction - creates ripples
  let ripple = smoothstep(0.3, 0.0, distFromMouse) * 0.05;

  // Combine effects for final refraction
  let refractNormal = toCenter + morph;
  let refractedUV = glassRefraction(uv, refractNormal, bubbleStrength + ripple);

  // Sample background with refracted coordinates
  var color = textureSample(bgTexture, bgSampler, refractedUV);

  // Add glass characteristics
  // 1. Slight blue tint
  let glassTint = vec3f(0.98, 0.99, 1.02);
  color = vec4f(color.rgb * glassTint, color.a);

  // 2. Edge highlights (Fresnel effect)
  let fresnel = pow(1.0 - abs(dot(normalize(vec3f(toCenter, 0.0)), vec3f(0.0, 0.0, 1.0))), 3.0);
  let edgeHighlight = vec3f(1.0) * fresnel * 0.4 * bubbleStrength;

  // 3. Specular highlights
  let spec = pow(max(0.0, 1.0 - dist * 2.0), 8.0) * 0.3;

  // Combine all effects
  let finalColor = color.rgb + edgeHighlight + vec3f(spec);

  // Alpha based on glass strength
  let alpha = 0.15 + bubbleStrength * 0.3;

  return vec4f(finalColor, alpha);
}
`;

export function initLiquidGlass(canvas: HTMLCanvasElement) {
  let device: GPUDevice;
  let pipeline: GPURenderPipeline;
  let bindGroup: GPUBindGroup;
  let uniformBuffer: GPUBuffer;
  let context: GPUCanvasContext;
  let animationId: number;
  let startTime = Date.now();
  let mouseX = 0.5;
  let mouseY = 0.5;

  const uniformData = new Float32Array(4); // time, mouseX, mouseY, intensity

  async function init() {
    if (!navigator.gpu) {
      console.warn("WebGPU not supported");
      return false;
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      console.warn("No WebGPU adapter found");
      return false;
    }

    device = await adapter.requestDevice();
    context = canvas.getContext("webgpu") as GPUCanvasContext;

    const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    context.configure({
      device,
      format: presentationFormat,
      alphaMode: "premultiplied",
    });

    // Create uniform buffer
    uniformBuffer = device.createBuffer({
      size: 16, // 4 floats * 4 bytes
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    // Create shader module
    const shaderModule = device.createShaderModule({
      code: REFRACTION_SHADER_WGSL,
    });

    // Capture background as texture
    const bgTexture = await captureBackground(device, canvas);

    const sampler = device.createSampler({
      magFilter: "linear",
      minFilter: "linear",
      addressModeU: "clamp-to-edge",
      addressModeV: "clamp-to-edge",
    });

    // Create pipeline
    pipeline = device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: shaderModule,
        entryPoint: "vs_main",
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fs_main",
        targets: [{
          format: presentationFormat,
          blend: {
            color: {
              srcFactor: "src-alpha",
              dstFactor: "one-minus-src-alpha",
              operation: "add",
            },
            alpha: {
              srcFactor: "one",
              dstFactor: "one-minus-src-alpha",
              operation: "add",
            },
          },
        }],
      },
      primitive: {
        topology: "triangle-list",
      },
    });

    bindGroup = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: uniformBuffer } },
        { binding: 1, resource: bgTexture.createView() },
        { binding: 2, resource: sampler },
      ],
    });

    // Mouse tracking
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
    });

    render();
    return true;
  }

  async function captureBackground(device: GPUDevice, canvas: HTMLCanvasElement): Promise<GPUTexture> {
    // Capture the page content below the canvas
    // For now, create a gradient - in production, use html2canvas or similar
    const size = 1024;
    const textureData = new Uint8Array(size * size * 4);

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const i = (y * size + x) * 4;
        const nx = x / size;
        const ny = y / size;

        // Create colorful gradient
        textureData[i] = Math.floor(nx * 200 + 55); // R
        textureData[i + 1] = Math.floor(ny * 200 + 55); // G
        textureData[i + 2] = Math.floor((1 - nx) * 200 + 55); // B
        textureData[i + 3] = 255; // A
      }
    }

    const texture = device.createTexture({
      size: [size, size],
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });

    device.queue.writeTexture(
      { texture },
      textureData,
      { bytesPerRow: size * 4 },
      [size, size]
    );

    return texture;
  }

  function render() {
    if (!device || !pipeline || !context) return;

    const time = (Date.now() - startTime) / 1000;

    // Update uniforms
    uniformData[0] = time;
    uniformData[1] = mouseX;
    uniformData[2] = mouseY;
    uniformData[3] = 1.0; // intensity

    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    const commandEncoder = device.createCommandEncoder();
    const textureView = context.getCurrentTexture().createView();

    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [{
        view: textureView,
        clearValue: { r: 0, g: 0, b: 0, a: 0 },
        loadOp: "clear",
        storeOp: "store",
      }],
    });

    renderPass.setPipeline(pipeline);
    renderPass.setBindGroup(0, bindGroup);
    renderPass.draw(6);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);

    animationId = requestAnimationFrame(render);
  }

  function destroy() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  }

  init();

  return { destroy };
}
