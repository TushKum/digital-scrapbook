import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` defaults to '/' because the production build is served from the root
// of the full-stack service (the Express server serves dist/ alongside /api).
// Override with VITE_BASE at build time if hosting under a subpath (e.g. a
// GitHub Pages project path '/repo/').
//
// The dev server honours the `PORT` env var so the preview harness can assign a
// free port (autoPort), and proxies `/api` to the Express backend so the client
// can use same-origin requests with no CORS in dev.
const API_PORT = process.env.API_PORT || '8787'

export default defineConfig(({ command }) => ({
  base: command === 'build' ? process.env.VITE_BASE ?? '/' : '/',
  plugins: [react()],
  resolve: {
    // Standard shadcn-style alias so components can import "@/lib/utils" etc.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
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
