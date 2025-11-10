import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { LodingProvider } from './context/LodingContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LodingProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LodingProvider>
  </StrictMode>,
)
