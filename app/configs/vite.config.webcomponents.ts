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
        ? "../dist-netlify/webcomponents"
        : "../dist/webcomponents"
    ),
    emptyOutDir: true, // Clear output directory before building
    minify: "terser", // Better minification
    cssMinify: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info"],
      },
    },
    lib: {
      entry: path.resolve(
        __dirname,
        "../../src/experimental/web-components/index.tsx"
      ),
      name: "RHNGUIWebComponents",
      fileName: () => "rhngui-webcomponents.js",
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        assetFileNames: "rhngui-webcomponents.[ext]",
      },
      // Tree shaking optimizations
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
      },
    },
  },
});
