import { defineConfig } from "vite";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";

import { aliases } from "./configs/folder-paths-aliases";

// https://vite.dev/config/
export default defineConfig({
  server: {
    open: true,
  },
  resolve: {
    alias: aliases,
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
});
