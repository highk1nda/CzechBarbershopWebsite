import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import AdminApp from './admin/AdminApp'
import { AuthProvider } from './context/AuthContext'
import { ContentProvider } from './context/ContentContext'
import './i18n'
import './index.css'
import { initTwemoji } from './utils/twemoji'

const root = document.getElementById('root')

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ContentProvider>
          <Routes>
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </ContentProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)

initTwemoji(root)
