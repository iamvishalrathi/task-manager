// MSW Configuration constants
export const MSW_CONFIG = {
  // Only intercept requests that match our API patterns
  SERVICE_WORKER_URL: '/mockServiceWorker.js',
  API_BASE_URL: '/api',
  
  // MSW Options
  START_OPTIONS: {
    onUnhandledRequest: 'bypass' as const,
    quiet: false,
    waitUntilReady: true,
  },
  
  // Enable in development OR when explicitly enabled via env var
  ENABLED: import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW === 'true',
} as const;

export default MSW_CONFIG;
