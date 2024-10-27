import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    build: {
      outDir: '../build',
      emptyOutDir: true
    },
    define: {
      'process.env.VITE_BACKEND': JSON.stringify(env.VITE_BACKEND_URL)
    }
  }
})
