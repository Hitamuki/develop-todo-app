import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { UserLoginResponseDto, UserPostRequestDto, UserGetResponseDto } from '../api'; // Assuming UserGetResponseDto is used for user details in login response

export const mockApiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Mock Login
  if (req.url.includes('/auth/login') && req.method === 'POST') {
    const { email, password } = req.body as any; // Type assertion for simplicity in mock
    console.log('Mock API: Intercepted login request for email:', email);
    if (email === 'test@example.com' && password === 'password') {
      const mockLoginResponse: UserLoginResponseDto = {
        accessToken: 'fake-jwt-token',
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com'
        } as UserGetResponseDto // Assuming UserGetResponseDto is the type for the 'user' object
      };
      console.log('Mock API: Login success for test@example.com');
      return of(new HttpResponse({ status: 200, body: mockLoginResponse })).pipe(delay(500));
    } else {
      console.log('Mock API: Login failed for', email);
      return of(new HttpResponse({ status: 401, body: { message: 'Invalid credentials' } })).pipe(delay(500));
    }
  }

  // Mock Registration
  if (req.url.includes('/users') && req.method === 'POST') {
    const userData = req.body as UserPostRequestDto;
    console.log('Mock API: Intercepted registration request for email:', userData.email);
    if (userData.email === 'existing@example.com') {
      console.log('Mock API: Registration conflict for existing@example.com');
      return of(new HttpResponse({ status: 409, body: { message: 'Email already exists' } })).pipe(delay(500));
    } else {
      const mockRegistrationResponse: UserGetResponseDto = { // Assuming registration returns the created user, similar to UserGetResponseDto
        id: `mock-user-${Date.now()}`,
        name: userData.name || 'Unnamed User',
        email: userData.email
      };
      console.log('Mock API: Registration success for', userData.email);
      return of(new HttpResponse({ status: 201, body: mockRegistrationResponse })).pipe(delay(500));
    }
  }

  // Pass through other requests
  return next(req);
};
