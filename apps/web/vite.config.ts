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
        id: '/',
        start_url: '/',
        scope: '/',
        name: 'VIAXEN',
        short_name: 'VIAXEN',
        description: 'Calcule rotas rodoviárias e fretes ANTT em segundos.',
        theme_color: '#FF7A00',
        background_color: '#EDE0C4',
        display: 'standalone',
        orientation: 'portrait',
        lang: 'pt-BR',
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
