import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: "./src/index.tsx", // Ensure this exists
      name: "DynamicUI",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format}.js`,
    },
    // Target modern browsers for smaller bundles
    target: "es2020",
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Enable minification
    minify: "esbuild",
    rollupOptions: {
      external: (id) => {
        // Externalize all React-related imports
        return (
          id === "react" ||
          id === "react-dom" ||
          id.startsWith("react/") ||
          id.startsWith("react-dom/")
        );
      },
      output: {
        exports: "named",
        // Manual chunk splitting for better caching
        manualChunks: {
          // Separate PatternFly into its own chunk
          patternfly: [
            "@patternfly/react-core",
            "@patternfly/react-table",
            "@patternfly/react-data-view",
          ],
        },
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react/jsx-runtime": "React",
          "react/jsx-dev-runtime": "React",
          "react-dom/client": "ReactDOM",
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.tsx",
    server: {
      deps: {
        inline: ["@patternfly/react-data-view", "@patternfly/react-tokens"],
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "src/test/",
        "**/*.test.{ts,tsx}",
        "**/*.config.{ts,js}",
        "dist/",
      ],
    },
  },
});
