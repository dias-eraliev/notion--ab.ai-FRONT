import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8119,
  },
  preview: {
    allowedHosts: ["fizmat-ala.abai.live", "fizmat.abai.live", "localhost"],
    port: 8119,
    host: "::"
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