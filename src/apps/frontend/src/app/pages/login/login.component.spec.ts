import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Added ReactiveFormsModule if any Material components use it internally for forms
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // Import NoopAnimationsModule for Material animations

import { LoginComponent } from './login.component';
import { UsersService } from '../../api/api/users.service';
import { UserGetResponseDto } from '../../api/model/user-get-response-dto';

// Import Angular Material Modules used in LoginComponent's template
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // If used

// Mock UsersService (remains the same)
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
    return throwError(() => ({ status: 400, error: { message: 'Bad Request' } }));
  }
}

// Dummy components for RouterTestingModule (remains the same)
class DummyHomeComponent {}
class DummyRegisterComponent {}

describe('LoginComponent with Angular Material', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let usersService: UsersService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent, // Standalone component, already imports its own Material modules
        FormsModule,
        // ReactiveFormsModule, // Add if needed by MatFormField or other Material components under the hood
        CommonModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: DummyHomeComponent {} },
          { path: 'register', component: DummyRegisterComponent {} }
        ]),
        HttpClientTestingModule,
        NoopAnimationsModule, // For Material animations
        // Material modules used by the component are already imported by LoginComponent itself as it's standalone
      ],
      providers: [
        { provide: UsersService, useClass: MockUsersService },
        { provide: ActivatedRoute, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);
    router = TestBed.inject(Router);
    fixture.detectChanges(); // Initial data binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render login form with Material components', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-card-title')?.textContent).toContain('Login');
    expect(compiled.querySelector('input[matInput][name="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[matInput][name="password"]')).toBeTruthy();
    expect(compiled.querySelector('button[mat-raised-button][type="submit"]')).toBeTruthy();
  });

  it('should show Material validation error if email is not provided', fakeAsync(() => {
    fixture.detectChanges(); // Ensure component is stable

    const emailInput = fixture.nativeElement.querySelector('input[name="email"]') as HTMLInputElement;
    emailInput.value = '';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur')); // Trigger touched for validation

    // Manually set the ngModel control's state for testing errors
    component.emailField = { invalid: true, dirty: true, touched: true, errors: { required: true } };

    fixture.detectChanges(); // Re-run change detection to show mat-error
    tick(); // Allow time for UI to update
    fixture.detectChanges(); // One more for safety with async error display

    const compiled = fixture.nativeElement as HTMLElement;
    const matError = compiled.querySelector('mat-form-field[class*="mb-3"] mat-error'); // More specific selector
    expect(matError?.textContent).toContain('Email is required.');
  }));

  it('should call UsersService.getUser and navigate to /home on successful login', fakeAsync(() => {
    spyOn(usersService, 'getUser').and.callThrough();
    spyOn(router, 'navigate').and.stub();

    component.email = 'test@example.com';
    component.password = 'password123';
    fixture.detectChanges();

    const loginButton = fixture.nativeElement.querySelector('button[mat-raised-button][type="submit"]');
    loginButton.click();
    tick();

    expect(usersService.getUser).toHaveBeenCalledWith('test@example.com');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
    expect(component.loginError).toBeNull();
  }));

  it('should display error message in alert div if user is not found (404)', fakeAsync(() => {
    spyOn(usersService, 'getUser').and.callThrough();
    spyOn(router, 'navigate').and.stub();

    component.email = 'unknown@example.com';
    component.password = 'password123';
    fixture.detectChanges();

    const loginButton = fixture.nativeElement.querySelector('button[mat-raised-button][type="submit"]');
    loginButton.click();
    tick();

    expect(usersService.getUser).toHaveBeenCalledWith('unknown@example.com');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.loginError).toContain('Login failed. User not found.');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    // The error message is now in a specific div.alert.alert-danger
    expect(compiled.querySelector('div.alert.alert-danger')?.textContent).toContain('Login failed. User not found.');
  }));

  it('should display generic error message in alert div for other API errors (e.g., 500)', fakeAsync(() => {
    spyOn(usersService, 'getUser').and.callThrough();
    spyOn(router, 'navigate').and.stub();

    component.email = 'error@example.com';
    component.password = 'password123';
    fixture.detectChanges();

    const loginButton = fixture.nativeElement.querySelector('button[mat-raised-button][type="submit"]');
    loginButton.click();
    tick();

    expect(usersService.getUser).toHaveBeenCalledWith('error@example.com');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.loginError).toContain('Internal Server Error');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div.alert.alert-danger')?.textContent).toContain('Internal Server Error');
  }));

  it('should have a link to the register page in mat-card-actions', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const registerLink = compiled.querySelector('mat-card-actions a[routerLink="/register"]');
    expect(registerLink).toBeTruthy();
    expect(registerLink?.textContent).toContain('Register here');
  });
});
