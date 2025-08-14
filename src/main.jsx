import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import store from './store/index.jsx'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_OAUTH_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
