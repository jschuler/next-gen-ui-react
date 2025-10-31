import path from "path";
import { fileURLToPath } from "url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// ESM-safe __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  // Use base path for GitHub Pages, but allow override with VITE_BASE_PATH env var
  base:
    process.env.VITE_BASE_PATH ||
    (process.env.NODE_ENV === "production" ? "/next-gen-ui-react/" : "/"),
  resolve: {
    alias: {
      // allow importing components from the parent package source
      "@local-lib": path.resolve(__dirname, "..", "src"),
    },
  },
  server: {
    port: 5176,
  },
  optimizeDeps: {
    include: [
      "@patternfly/react-charts/victory",
      "victory",
      "victory-core",
      "victory-legend",
      "victory-chart",
      "victory-bar",
      "victory-line",
      "victory-pie",
    ],
  },
  build: {
    outDir: process.env.NETLIFY_BUILD ? "dist-netlify" : "dist",
    commonjsOptions: {
      include: [/node_modules/, /victory/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-charts": ["@patternfly/react-charts/victory", "victory"],
        },
      },
    },
  },
});
