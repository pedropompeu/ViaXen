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
      devOptions: {
        enabled: true
      },
      workbox: {
        // Arquivos .wasm do DuckDB chegam a 41MB — excluir do precache do SW
        globIgnores: ['**/*.wasm'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB para os demais assets
      },
      manifest: {
        name: 'VIAXEN',
        short_name: 'VIAXEN',
        description: 'Route Intelligence Platform — Cálculo de Rota e Frete',
        theme_color: '#0D1117',
        background_color: '#080C10',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ]
      }
    })
  ],
})
