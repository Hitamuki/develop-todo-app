// src/apps/frontend/src/environments/environment.prod.ts

// Define a fallback API URL for production.
// This might be used if config.js fails to load or API_URL was not properly set.
// A relative path is often a good fallback if the frontend and API are served under the same domain by ALB.
const productionFallbackApiUrl = '/api'; // Assumes ALB routes /api to the backend.

export const environment = {
  production: true,
  // Try to get apiUrl from the global window.appConfig object set by config.js
  // Fallback to productionFallbackApiUrl if window.appConfig or window.appConfig.apiUrl is not defined.
  apiUrl: (window as any).appConfig?.apiUrl || productionFallbackApiUrl
};
