import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { AuthService as ApiAuthService } from '../api/api/auth.service';
import { UsersService as ApiUsersService } from '../api/api/users.service';
import { UserLoginRequestDto, UserLoginResponseDto, UserPostRequestDto } from '../api'; // Assuming models are exported from api/index.ts

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserLoginResponseDto | null>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'authToken';

  constructor(
    private router: Router,
    private apiAuthService: ApiAuthService,
    private apiUsersService: ApiUsersService
  ) {
    this.loadToken(); // Try to load token on service initialization
  }

  private loadToken(): void {
    const token = this.getToken();
    if (token) {
      // In a real app, you would validate the token with the backend here
      // and fetch user details if the token is valid.
      // For now, we'll assume if a token exists, it's for a logged-in user.
      // We don't have the full UserLoginResponseDto, so we can't populate currentUserSubject
      // without an API call. For isAuthenticated, just checking token existence is enough for now.
      // If you need user info throughout the app from local storage, consider storing a minimal User object.
    }
  }

  login(credentials: UserLoginRequestDto): Observable<UserLoginResponseDto> {
    return this.apiAuthService.login(credentials).pipe(
      tap((response: UserLoginResponseDto) => {
        if (response && response.accessToken) {
          localStorage.setItem(this.TOKEN_KEY, response.accessToken);
          // To keep things simple, we don't store the whole user object from login in currentUserSubject directly
          // as it might become stale. Instead, isAuthenticated relies on the token.
          // A dedicated user profile service could fetch and manage user data.
          this.currentUserSubject.next(response); // Or a subset of it
          this.router.navigate(['/home']);
        }
      }),
      catchError(err => {
        console.error('Login failed', err);
        // Clear any existing token on login failure
        localStorage.removeItem(this.TOKEN_KEY);
        this.currentUserSubject.next(null);
        throw err; // Re-throw the error to be caught by the component
      })
    );
  }

  register(userData: UserPostRequestDto): Observable<any> { // Adjust 'any' to specific DTO if available
    return this.apiUsersService.usersPost(userData).pipe(
      tap(() => {
        this.router.navigate(['/login']);
      }),
      catchError(err => {
        console.error('Registration failed', err);
        throw err; // Re-throw the error
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    // Basic check: does a token exist?
    // In a real app: decode token, check expiry, etc.
    return !!token;
  }

  // Optional: If you need to access the current user's data stored from login
  public get currentUserValue(): UserLoginResponseDto | null {
    return this.currentUserSubject.value;
  }
}
