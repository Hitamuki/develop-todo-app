// src/apps/frontend/src/environments/environment.ts

// Define a fallback API URL for local development when 'ng serve' is used,
// or if window.appConfig.apiUrl is not available for some reason.
const localDevApiUrl = 'http://localhost:8080/api'; // TODO: Adjust port if your local backend runs elsewhere (e.g. 5000 for .NET default)

export const environment = {
  production: false,
  // Try to get apiUrl from the global window.appConfig object set by config.js
  // Fallback to localDevApiUrl if window.appConfig or window.appConfig.apiUrl is not defined.
  apiUrl: (window as any).appConfig?.apiUrl || localDevApiUrl
};
