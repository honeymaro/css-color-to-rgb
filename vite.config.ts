import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "./lib/index.ts",
      name: "css-color-to-rgb",
      fileName: "index",
      formats: ["es", "cjs"],
    },
  },
  plugins: [dts()],
});
