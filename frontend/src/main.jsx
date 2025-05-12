import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import WhatsAppChatButton from './components/Common/WhatsappChatButton.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <WhatsAppChatButton />
  </StrictMode>,
)
