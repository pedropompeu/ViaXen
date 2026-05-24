import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
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
        name: 'RotaCerta',
        short_name: 'RotaCerta',
        description: 'Planejamento Logístico e Cálculo de Frete',
        theme_color: '#020617',
        background_color: '#020617',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ]
      }
    })
  ],
})
