import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// `base` is only applied to production builds so the app works under the GitHub
// Pages project path (https://<user>.github.io/neervana/) while local dev and
// `vite preview` continue to serve from root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/neervana/' : '/',
  plugins: [react()],
}))
