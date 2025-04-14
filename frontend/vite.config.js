import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
//import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react()
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.ico'],
    //   manifest: {
    //     name: 'My App',
    //     short_name: 'App',
    //     start_url: '/',
    //     display: 'standalone',
    //   },
    // }),
  ],
  server: {
    port: 3000, 
    //host: '172.30.246.114'
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    environment: 'jsdom', 
  },
});
