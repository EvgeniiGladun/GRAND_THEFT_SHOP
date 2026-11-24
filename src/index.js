import React from 'react'
import { createRoot } from 'react-dom/client'
import App from 'app/App'
import 'app/styles/index.css'
import 'features/sound'

document.documentElement.style.setProperty('--shop-bg', 'url("/bg.webp")')
document.documentElement.style.setProperty('--catalog-map', 'url("/map.png")')

const rootView = document.getElementById('root')

if (rootView) {
  createRoot(rootView).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
