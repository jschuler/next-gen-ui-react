import path from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
    "import.meta.env.MODE": '"production"',
    "import.meta.env.DEV": "false",
    "import.meta.env.PROD": "true",
  },
  build: {
    outDir: path.resolve(__dirname, "../dist/webcomponents"),
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
      entry: path.resolve(__dirname, "../../src/web-components/index.tsx"),
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
