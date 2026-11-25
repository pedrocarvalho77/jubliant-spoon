import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH is set when deploying under a sub-path (GitHub Pages: /<repo>/)
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  server: { port: 3000 },
});
