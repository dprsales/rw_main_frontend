import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './fonts.css'
import './global.css'
/* Listing Tailwind + .sy-root components — after global.css so @apply rules win the cascade. */
import './listings/listings.css'
import './kenyt-delay.js'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
