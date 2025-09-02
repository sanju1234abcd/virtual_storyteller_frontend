import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import { AppProvider } from './AppContext'
import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log("New version available, refresh app.")
  },
  onOfflineReady() {
    console.log("App ready to work offline.")
  },
})

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <AppProvider>
    <App />
    <Toaster/>
  </AppProvider>
  </BrowserRouter>,
)
