import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import { AppProvider } from './AppContext'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <AppProvider>
    <App />
    <Toaster/>
  </AppProvider>
  </BrowserRouter>,
)
