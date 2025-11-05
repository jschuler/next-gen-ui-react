import path from "path";
import { fileURLToPath } from "url";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  publicDir: false, // Don't copy public folder for library builds
  define: {
    "process.env": {},
    "import.meta.env.MODE": '"production"',
    "import.meta.env.DEV": "false",
    "import.meta.env.PROD": "true",
  },
  build: {
    outDir: path.resolve(
      __dirname,
      process.env.NETLIFY_BUILD
        ? "../dist-netlify/standalone"
        : "../dist/standalone"
    ),
    emptyOutDir: true, // Clear output directory before building
    minify: "terser", // Better minification than esbuild
    cssMinify: true,
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"], // Remove specific console calls
      },
    },
    lib: {
      entry: path.resolve(
        __dirname,
        "../../src/experimental/standalone/index.tsx"
      ),
      name: "RHNGUIRenderer",
      fileName: (format) => `rhngui-standalone.${format}.js`,
      formats: ["iife"], // Only IIFE, remove UMD for smaller output
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-dom/client"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-dom/client": "ReactDOM",
        },
        assetFileNames: "rhngui-standalone.[ext]",
        // Optimize chunk splitting
        manualChunks: undefined,
      },
      // Tree shaking optimizations
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },
  },
});
