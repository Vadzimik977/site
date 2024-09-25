import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import nodePolyfills from 'vite-plugin-node-stdlib-browser';

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), nodePolyfills()],
    build: {
      outDir: '../build'
    },
    define: {
      'process.env.VITE_BACKEND': JSON.stringify(env.VITE_BACKEND_URL)
    }
  }
})
