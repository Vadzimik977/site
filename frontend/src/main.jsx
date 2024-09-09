import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

//import './css/style.min.css'
import './scss/style.scss'
import './css/libs.min.css'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import router from './router.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl='./ton-manifest.json'>
      <RouterProvider router={router} />
    </TonConnectUIProvider>
  </StrictMode>,
)
