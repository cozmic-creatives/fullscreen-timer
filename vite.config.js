import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { pwaConfig } from "./src/utils/pwaConfig";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA(pwaConfig)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
