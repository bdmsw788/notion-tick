import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
    proxy: {
      '/api/notion': {
        target: 'https://api.notion.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/notion/, '/v1'),
        headers: {
          'Notion-Version': '2022-06-28',
        },
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        church_navigator: './church_building_navigator.html',
      },
    },
  },
});
