import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import copy from 'rollup-plugin-copy'
import { VitePWA } from 'vite-plugin-pwa'
import eslintPlugin from 'vite-plugin-eslint'
import viteStylelint from '@amatlash/vite-plugin-stylelint'
import path from 'path'

export default defineConfig({
  build: {
    sourcemap: process.env.SOURCE_MAP === 'true'
  },
  base: '/kobo-book-exporter',
  plugins: [
    vue(),
    viteStylelint(),
    VitePWA({
      mode: 'development',
      srcDir: 'src',
      filename: 'sw.js',
      base: '/kobo-book-exporter/',
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
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
    eslintPlugin({
      include: ['src/**/*.vue', 'src/**/*.js']
    }),
    copy({
      targets: [
        { src: 'node_modules/sql.js/dist/sql-wasm.wasm', dest: './public' },
      ]
    })
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src')
      }
    ]
  }
})
