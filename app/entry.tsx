import { createRoot } from "@remix-run/dom";
import { PackingListApp } from "./components/packing/PackingListApp";
import { initLiquidGlass } from "./components/webgpu/LiquidGlass";
import "./styles.css";

const root = document.getElementById("root")!;

// Initialize WebGPU liquid glass canvas
const glassCanvas = document.createElement("canvas");
glassCanvas.id = "liquid-glass";
glassCanvas.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
`;
glassCanvas.width = window.innerWidth;
glassCanvas.height = window.innerHeight;
document.body.appendChild(glassCanvas);

// Init WebGPU
initLiquidGlass(glassCanvas);

// Handle resize
window.addEventListener("resize", () => {
  glassCanvas.width = window.innerWidth;
  glassCanvas.height = window.innerHeight;
});

createRoot(root).render(
  <div className="min-h-[100dvh] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
    {/* Animated gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950"></div>

    {/* Animated orbs for liquid effect */}
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/30 dark:bg-blue-600/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 animate-blob"></div>
    <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/30 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-400/30 dark:bg-pink-600/20 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

    <div className="w-full max-w-4xl relative z-10 liquid-container">
      <PackingListApp />
    </div>
  </div>
);

