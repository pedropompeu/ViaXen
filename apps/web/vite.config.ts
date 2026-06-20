import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true
      },
      workbox: {
        // DuckDB .wasm chega a 41MB — excluir do precache
        globIgnores: ['**/*.wasm'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,

        // Offline: serve index.html para qualquer rota SPA não encontrada no cache
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],

        // Cache de runtime para APIs externas
        runtimeCaching: [
          {
            // Tiles do OpenStreetMap — cache de longa duração
            urlPattern: /^https:\/\/[abc]\.tile\.openstreetmap\.org\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'osm-tiles',
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Geocodificação Nominatim — cache curto (dados mudam)
            urlPattern: /^https:\/\/nominatim\.openstreetmap\.org\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'nominatim-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // OSRM routing — NetworkFirst com fallback
            urlPattern: /^https:\/\/router\.project-osrm\.org\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'osrm-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 6 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        id: '/',
        start_url: '/',
        scope: '/',
        name: 'VIAXEN',
        short_name: 'VIAXEN',
        description: 'Calcule rotas rodoviárias e fretes ANTT em segundos.',
        theme_color: '#FF7A00',
        background_color: '#EDE0C4',
        display: 'standalone',
        // Fallback chain: WCO (título nativo no desktop) → standalone → minimal-ui
        display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
        orientation: 'portrait',
        lang: 'pt-BR',
        dir: 'ltr',
        categories: ['business', 'productivity', 'utilities'],
        prefer_related_applications: false,
        // Foca janela existente ao reabrir o app (evita múltiplas instâncias)
        launch_handler: {
          client_mode: 'focus-existing',
        },
        // Receber endereços compartilhados de outros apps (Google Maps, WhatsApp etc.)
        share_target: {
          action: '/',
          method: 'GET',
          params: {
            title: 'title',
            text: 'text',
            url: 'url',
          },
        },
        icons: [
          { src: 'icon-192.png',          sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png',          sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        screenshots: [
          {
            src: 'screenshots/desktop.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Cálculo de rotas e fretes ANTT',
          },
          {
            src: 'screenshots/mobile.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'VIAXEN no celular',
          },
        ],
      },
    }),
  ],
})
