import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { UIProvider, extendConfig } from "@yamada-ui/react"
import App from './App.jsx'
import "./common.css"

export const config = {
  initialColorMode: "dark",
}

const customConfig = extendConfig(config)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UIProvider config={customConfig}>
      <App />
    </UIProvider>
  </StrictMode>,
)
