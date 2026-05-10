import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    globals: false,
    // CSS / PostCSS işlemini devre dışı bırak (Tailwind v4 PostCSS plugin'i Vite ile uyumsuz)
    css: false,
  },
  // PostCSS config'ini de Vite tarafında devre dışı bırak
  css: {
    postcss: {
      plugins: [],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
