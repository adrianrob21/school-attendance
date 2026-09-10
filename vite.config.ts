import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";

import { aliases } from "./configs/folder-paths-aliases";
import { createStudentVoiceMiddleware } from "./server/studentVoice.mjs";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "PIPER_");
  const voiceMiddleware = createStudentVoiceMiddleware({
    pythonPath: process.env.PIPER_PYTHON || env.PIPER_PYTHON,
    modelPath: process.env.PIPER_MODEL || env.PIPER_MODEL,
  });
  return {
    server: {
      open: true,
    },
    resolve: {
      alias: aliases,
      extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
    plugins: [
      {
        name: "student-voice-preparation",
        configureServer(server) {
          server.middlewares.use(voiceMiddleware);
        },
        configurePreviewServer(server) {
          server.middlewares.use(voiceMiddleware);
        },
      },
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
  };
});
