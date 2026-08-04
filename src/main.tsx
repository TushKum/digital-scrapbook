import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import InstallPrompt from './components/ui/InstallPrompt.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <InstallPrompt />
  </StrictMode>,
)

// Register the service worker (production builds only) so the app is
// installable and works offline. Failure is silent — the app still runs.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  })
}
