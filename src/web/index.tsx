import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'

ReactDOM.createRoot(document.getElementById('tinyReactImageEditor') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
