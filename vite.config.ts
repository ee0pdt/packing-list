import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/packing-list/",
  plugins: [
    remix({
      basename: "/packing-list/",
      ssr: false,
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
    }),
  ],
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
});