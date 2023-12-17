import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import eslintPlugin from 'vite-plugin-eslint'
import StylelintPlugin from 'vite-plugin-stylelint'
import electron from 'vite-plugin-electron/simple'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isElectron = mode === 'electron'
  return {
    ...(!isElectron && {base: '/kobo-book-exporter/'}),
    build: {
      ...(!isElectron && { outDir: 'dist-page', emptyOutDir: true }),
      target: 'esnext'
    },
    plugins: [
      vue(),
      electron({
        main: {
          entry: 'electron/main.ts',
        },
        preload: {
          input: path.join(__dirname, 'electron/preload.ts'),
        },
        renderer: {},
      }),
      VitePWA({
        workbox: {
          sourcemap: true
        },
        mode: 'development',
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'Kobo Book Exporter',
          short_name: 'Kobo Book Exporter',
          description: 'Kobo Book Exporter',
          theme_color: '#0079d2',
          start_url: './index.html',
          lang: 'zh-Hant-HK',
          dir: 'ltr',
          orientation: 'portrait',
          icons: [
            {
              src: 'img/icons/android-chrome-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'img/icons/android-chrome-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'img/icons/android-chrome-maskable-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'maskable'
            },
            {
              src: 'img/icons/android-chrome-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ]
        }
      }),
      StylelintPlugin({
        fix: true,
      }),
      eslintPlugin({
        include: ['src/**/*.vue', 'src/**/*.js'],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
