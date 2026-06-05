if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
if (window.location.hash) history.replaceState(null, '', window.location.pathname)
window.scrollTo(0, 0)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)