import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'
import './index.css'
import App from './App.tsx'

// Intercept requests to replace localhost API URL with production API URL if set in env
axios.interceptors.request.use((config) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && config.url) {
    // Trim trailing slash from apiUrl if present to prevent double slashes
    const trimmedApiUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
    config.url = config.url.replace('http://localhost:5000', trimmedApiUrl);
  }
  return config;
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
