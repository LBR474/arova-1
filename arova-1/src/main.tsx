import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('R3F-app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
