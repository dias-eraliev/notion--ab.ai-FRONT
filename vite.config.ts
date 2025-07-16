import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8119,
  },
  preview: {
    port: 8119,
    host: "::",
    allowedHosts: ["*.abai.live", "fizmat-ala.abai.live"]
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['recharts']
  }
}); 