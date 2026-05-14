import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Auth Service (Node.js :3001)
      '/api/auth': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api/users': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },

      // AI Services (Python/FastAPI)
      '/ai/face': {
        target: 'http://localhost:8091',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai\/face/, ''),
      },
      '/ai/eye': {
        target: 'http://localhost:8092',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai\/eye/, ''),
      },
      '/ai/audio': {
        target: 'http://localhost:8093',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai\/audio/, ''),
      },
      '/ai/risk': {
        target: 'http://localhost:8094',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai\/risk/, ''),
      },

      // Exam Service (yarın gelecek — :3002)
      '/api/exams': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
      '/api/sessions': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
    },
  },
});
