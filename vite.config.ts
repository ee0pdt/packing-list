import { defineConfig } from "vite";

export default defineConfig({
  base: "/",
  resolve: {
    alias: {
      "@": "/app",
    },
  },
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    strictPort: false,
    allowedHosts: [
      ".railway.app",
      ".up.railway.app",
      "localhost",
      "127.0.0.1",
    ],
  },
  esbuild: {
    jsxImportSource: "@remix-run/dom",
  },
});