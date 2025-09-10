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
  
  // Development only
  ENABLED: import.meta.env.DEV,
} as const;

export default MSW_CONFIG;
