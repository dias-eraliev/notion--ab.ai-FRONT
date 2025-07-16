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
    allowedHosts: ["fizmat-ala.abai.live", "*.abai.live",]
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