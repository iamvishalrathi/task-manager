import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Start MSW for both development and production (demo app)
async function enableMocking() {
  // Enable MSW for demo purposes in production too
  const shouldEnableMSW = import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW === 'true';
  
  if (shouldEnableMSW) {
    const { worker } = await import('./mocks/browser');
    const { MSW_CONFIG } = await import('./mocks/config');
    
    console.log('🔧 Starting MSW for API mocking...');
    
    return worker.start(MSW_CONFIG.START_OPTIONS).then(() => {
      console.log('✅ MSW started successfully - API requests will be mocked');
    });
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
