import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ApiProvider } from './contexts/ApiProvider'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApiProvider>
      <App />
    </ApiProvider>
    <Toaster
      position="bottom-right"
      duration={5000}
    ></Toaster>
  </StrictMode>,
)
