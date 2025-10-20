import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, Plugin } from "vite";

// Plugin to fix MUI directory imports in SSR build
const fixMuiImports = (): Plugin => ({
  name: "fix-mui-imports",
  enforce: "pre",
  resolveId(source) {
    // Fix directory imports by appending /index.js
    if (source.includes("@mui") && !source.endsWith(".js") && !source.includes("?")) {
      const paths = [
        "@mui/utils/formatMuiErrorMessage",
        "@mui/utils/deepmerge",
        "@mui/utils/capitalize",
        "@mui/utils/createChainedFunction",
      ];
      for (const path of paths) {
        if (source.endsWith(path)) {
          return `${source}/index.js`;
        }
      }
    }
    return null;
  },
});

export default defineConfig({
  base: "/packing-list/",
  plugins: [
    fixMuiImports(),
    remix({
      basename: "/packing-list/",
      ssr: false,
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
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
  ssr: {
    noExternal: ["@mui/material", "@mui/icons-material", "@emotion/react", "@emotion/styled"],
  },
});