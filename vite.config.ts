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
  esbuild: {
    jsxImportSource: "@remix-run/dom",
  },
});