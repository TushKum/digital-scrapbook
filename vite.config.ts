import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` is only applied to production builds so the app works under the GitHub
// Pages project path (https://<user>.github.io/neervana/) while local dev and
// `vite preview` continue to serve from root.
//
// The dev server honours the `PORT` env var so the preview harness can assign a
// free port (autoPort), and proxies `/api` to the Express backend so the client
// can use same-origin requests with no CORS in dev.
const API_PORT = process.env.API_PORT || '8787'
const VITE_BASE_URL = process.env.VITE_BASE_URL || '/'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? VITE_BASE_URL : '/',
  plugins: [react()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    strictPort: Boolean(process.env.PORT),
    proxy: {
      '/api': {
        target: `http://localhost:${API_PORT}`,
        changeOrigin: true,
      },
    },
  },
}))
