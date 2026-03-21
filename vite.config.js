import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    // We can conditionally disable PWA based on Vite compatibility, but updating to latest PWA should fix it.
    // If it still conflicts with Vite 8, we can completely remove VitePWA() from this plugins array
    // Let's try temporarily commenting it out to ensure the project runs first, as requested to "temporarily disable PWA support" if needed.
    /*
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Smart Room Dashboard',
        short_name: 'SmartRoom',
        description: 'Room Automation Dashboard for ESP32 and MQTT',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
    */
  ]
})
