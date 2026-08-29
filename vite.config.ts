import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true, // lets you test PWA on localhost
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/[^/]+\/(?!api\/).*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'app-cache',
            },
          }
        ],
      },
      manifest: {
        name: 'StockScore',
        short_name: 'StockScore',
        description: 'Turniersoftware für Stocksport',
        theme_color: '#0f0614',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/icons/192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
