import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ApiProvider } from './contexts/ApiProvider'
import { AuthProvider } from './contexts/AuthProvider'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ApiProvider>
        <App />
      </ApiProvider>
    </AuthProvider>
    <Toaster
      position="bottom-right"
      duration={5000}
    ></Toaster>
  </StrictMode>,
)
