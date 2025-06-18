import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Adjust path as necessary

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const authToken = authService.getToken();

  // Clone the request to add the new header.
  // Pass on the cloned request instead of the original request.
  if (authToken) {
    // Check if the request URL is for the API.
    // This is a basic check. You might need a more robust check if you have multiple API endpoints
    // or if some API calls should not have the token.
    // For now, we assume all requests to 'api/' should have the token.
    // The BASE_PATH for the API is configured, but the interceptor doesn't easily access it
    // without more complex setup. A simple path check is often sufficient.
    if (req.url.includes('/api/')) { // Or a more specific check based on your API base path
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      return next(authReq);
    }
  }

  return next(req);
};
