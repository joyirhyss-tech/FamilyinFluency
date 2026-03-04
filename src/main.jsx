import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { migrateOldData } from './utils/migrateStorage'

// One-time migration: moves existing unprefixed data to RHYSS-FAM namespace
migrateOldData();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
