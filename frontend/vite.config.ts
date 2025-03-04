import path from 'path';
import react from '@vitejs/plugin-react';
import basicSSL from '@vitejs/plugin-basic-ssl';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

const sslEnabled = process.env.SSL_ENABLED === 'true';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react(),
    ...(sslEnabled ? [basicSSL()] : []),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: ['apple-touch-icon.png', 'mask-icon.svg', 'assets/*.ttf', 'assets/*.svg'],
      workbox: {
        navigateFallbackDenylist: [/^\/api\//]
      },
      manifest: {
        name: 'Local Incident Services Application',
        short_name: 'LISA',
        theme_color: '#fff',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      '@shared-assets': path.resolve(
        process.cwd(),
        '../node_modules/@national-digital-twin/ndtp-styling-assets/dist/assets'
      ),
      '@shared-styles': path.resolve(
        process.cwd(),
        '../node_modules/@national-digital-twin/ndtp-styling-assets/dist/scss'
      ),
      common: path.resolve(__dirname, '../common')
    }
  }
});
