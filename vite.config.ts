import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import {VitePWA} from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.jpg",
        "robots.txt",
        "offline.html",
        "icons/*"  // includes your windows11/android/ios folders
      ],
      manifest: {
        name: "Your App Name",
        short_name: "App",
        description: "Your app description",
        theme_color: "#0b1220",
        background_color: "#0b1220",
        display: "standalone",
        start_url: "/",
        icons: [
    {
      src: "/icons/android/android-launchericon-192-192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "/icons/android/android-launchericon-512-512.png",
      sizes: "512x512",
      type: "image/png"
    },
    {
      src: "/icons/ios/180.png",
      sizes: "180x180",
      type: "image/png"
    },
    {
      src: "/icons/windows11/LargeTile.scale-200.png",
      sizes: "310x310",
      type: "image/png"
    }
  ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
