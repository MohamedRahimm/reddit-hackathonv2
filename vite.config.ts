import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  root: path.join(__dirname, "game"),
  build: {
    outDir: path.join(__dirname, "webroot"),
    emptyOutDir: true,
    copyPublicDir: true,
    sourcemap: true,
  },
});
