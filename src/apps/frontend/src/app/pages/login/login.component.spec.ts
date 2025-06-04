import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { UsersService } from '../../api/api/users.service';
import { UserGetResponseDto } from '../../api/model/user-get-response-dto';

// Mock UsersService
class MockUsersService {
  getUser(userId: string) {
    if (userId === 'test@example.com') {
      return of({
        id: 'test@example.com',
        email: 'test@example.com',
        name: 'Test User',
      } as UserGetResponseDto);
    } else if (userId === 'unknown@example.com') {
      return throwError(() => ({ status: 404, error: { message: 'User not found' } }));
    } else if (userId === 'error@example.com') {
      return throwError(() => ({ status: 500, error: { message: 'Internal Server Error' } }));
    }
    return throwError(() => ({ status: 400, error: { message: 'Bad Request' } })); // Default for other emails
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let usersService: UsersService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, // Standalone component
        FormsModule,
        CommonModule,
        RouterTestingModule.withRoutes([
          // Define a dummy route for '/home' to test navigation
          { path: 'home', component: class DummyHomeComponent {} },
          { path: 'register', component: class DummyRegisterComponent {} }
        ]),
        HttpClientTestingModule, // UsersService uses HttpClient
      ],
      providers: [
        { provide: UsersService, useClass: MockUsersService },
        // Provide a basic ActivatedRoute if needed by any part of the component/template
        { provide: ActivatedRoute, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render login form with email and password fields', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Login');
    expect(compiled.querySelector('input[name="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="password"]')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('should show validation error if email is not provided', fakeAsync(() => {
    const emailInput = fixture.nativeElement.querySelector('input[name="email"]');
    emailInput.value = '';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur')); // Trigger touched
    fixture.detectChanges();
    tick(); // allow time for async validation or update

    const compiled = fixture.nativeElement as HTMLElement;
    // Check for a specific error message div related to email required
    // This depends on how your HTML is structured for errors
    // For example: <div *ngIf="emailField.errors?.['required']">Email is required.</div>
    // A more robust way might be to check component.emailField.errors
    component.emailField.control.markAsTouched(); // Ensure control is marked as touched
    component.emailField.control.setValue('');
    fixture.detectChanges();
    expect(component.emailField.errors?.['required']).toBeTruthy();
    const alertDiv = compiled.querySelector('input[name="email"] + div.alert-danger');
    expect(alertDiv?.textContent).toContain('Email is required.');
  }));

  it('should call UsersService.getUser and navigate to /home on successful login', fakeAsync(() => {
    spyOn(usersService, 'getUser').and.callThrough();
    spyOn(router, 'navigate').and.stub();

    component.email = 'test@example.com';
    component.password = 'password123';
    fixture.detectChanges();

    const loginButton = fixture.nativeElement.querySelector('button[type="submit"]');
    loginButton.click();
    tick(); // Process async operations like service calls

    expect(usersService.getUser).toHaveBeenCalledWith('test@example.com');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
    expect(component.loginError).toBeNull();
  }));

  it('should display error message if user is not found (404)', fakeAsync(() => {
    spyOn(usersService, 'getUser').and.callThrough();
    spyOn(router, 'navigate').and.stub();

    component.email = 'unknown@example.com';
    component.password = 'password123';
    fixture.detectChanges();

    const loginButton = fixture.nativeElement.querySelector('button[type="submit"]');
    loginButton.click();
    tick();

    expect(usersService.getUser).toHaveBeenCalledWith('unknown@example.com');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.loginError).toContain('Login failed. User not found.');
    fixture.detectChanges(); // Update view with error
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.alert-danger')?.textContent).toContain('Login failed. User not found.');
  }));

  it('should display generic error message for other API errors (e.g., 500)', fakeAsync(() => {
    spyOn(usersService, 'getUser').and.callThrough();
    spyOn(router, 'navigate').and.stub();

    component.email = 'error@example.com';
    component.password = 'password123';
    fixture.detectChanges();

    const loginButton = fixture.nativeElement.querySelector('button[type="submit"]');
    loginButton.click();
    tick();

    expect(usersService.getUser).toHaveBeenCalledWith('error@example.com');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.loginError).toContain('Internal Server Error'); // Mock returns this message
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.alert-danger')?.textContent).toContain('Internal Server Error');
  }));

  it('should have a link to the register page', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const registerLink = compiled.querySelector('a[routerLink="/register"]');
    expect(registerLink).toBeTruthy();
    expect(registerLink?.textContent).toContain('Register here');
  });
});

// Dummy components for RouterTestingModule
class DummyHomeComponent {}
class DummyRegisterComponent {}
