import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Safely polyfill process.env for browser usage
    // This prevents "process is not defined" errors
    'process.env': {}
  }
});