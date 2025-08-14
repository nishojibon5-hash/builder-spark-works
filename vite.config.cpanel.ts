import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// cPanel hosting specific configuration
export default defineConfig({
  build: {
    outDir: "dist/cpanel",
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  base: "/", // Root path for cPanel hosting
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('/api'),
  },
});
