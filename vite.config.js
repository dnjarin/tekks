import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  plugins: [react()],

  define: {
    'process.env.DB_HOST': JSON.stringify(process.env.DB_HOST),
    'process.env.DB_USER': JSON.stringify(process.env.DB_USER),

  },

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
}));