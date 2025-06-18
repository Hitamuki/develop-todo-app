import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Adjust path as necessary

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    // Redirect to the login page if not authenticated
    // Call logout to clear any partial login state or stale tokens
    authService.logout(); // This will also navigate to /login
    // router.navigate(['/login']); // logout() already navigates
    return false;
  }
};
