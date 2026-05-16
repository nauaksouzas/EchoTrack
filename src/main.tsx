import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const originalFetch = window.fetch;
Object.defineProperty(window, 'fetch', {
  value: async (resource: RequestInfo | URL, config?: RequestInit) => {
    if (typeof resource === 'string' && resource.startsWith('/api')) {
      const token = localStorage.getItem('auth_token');
      const newConfig = { ...config } as RequestInit;
      newConfig.headers = new Headers(newConfig.headers || {});
      
      // Always omit credentials (cookies) to avoid cross-site cookie errors in iFrames
      newConfig.credentials = 'omit';
      
      if (token) {
        (newConfig.headers as Headers).set('Authorization', `Bearer ${token}`);
      }
      return originalFetch(resource, newConfig);
    }
    return originalFetch(resource, config);
  },
  configurable: true,
  writable: true
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
