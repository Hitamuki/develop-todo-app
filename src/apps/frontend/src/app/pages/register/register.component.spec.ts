import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { UsersService } from '../../api/api/users.service';
import { UserPostRequestDto } from '../../api/model/user-post-request-dto';
// No UserGetResponseDto needed here for postUser mock response based on current UsersService

// Mock UsersService
class MockUsersService {
  postUser(dto: UserPostRequestDto) {
    if (dto.email === 'existing@example.com') {
      return throwError(() => ({ status: 409, error: { message: 'User with this email already exists' } }));
    }
    if (dto.email === 'error@example.com') {
      return throwError(() => ({ status: 500, error: { message: 'Internal Server Error' } }));
    }
    if (dto.email && dto.password) {
      // Simulate successful registration - API returns 'any'
      return of({
        id: dto.email, // Mock response can include the new user's "ID" (email in this mock)
        name: dto.name,
        email: dto.email
      });
    }
    return throwError(() => ({ status: 400, error: { message: 'Bad Request' } }));
  }
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let usersService: UsersService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent, // Standalone component
        FormsModule,
        CommonModule,
        RouterTestingModule.withRoutes([
           { path: 'login', component: class DummyLoginComponent {} } // For potential future navigation
        ]),
        HttpClientTestingModule,
      ],
      providers: [
        { provide: UsersService, useClass: MockUsersService },
        { provide: ActivatedRoute, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);
    router = TestBed.inject(Router); // Inject router if navigation is added later
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render registration form with name, email, password, and confirm password fields', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Register');
    expect(compiled.querySelector('input[name="name"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="password"]')).toBeTruthy();
    expect(compiled.querySelector('input[name="confirmPassword"]')).toBeTruthy();
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('should show validation error if passwords do not match', fakeAsync(() => {
    component.model.name = 'Test User';
    component.model.email = 'test@example.com';
    component.model.password = 'password123';
    component.confirmPassword = 'password456';
    fixture.detectChanges();

    const registerButton = fixture.nativeElement.querySelector('button[type="submit"]');
    registerButton.click();
    tick();
    fixture.detectChanges();

    expect(component.registrationError).toBe('Passwords must match.');
    const compiled = fixture.nativeElement as HTMLElement;
    // This message is shown when form is submitted and passwords don't match
    // The actual div might be more specific if you have one for password mismatch error
    expect(compiled.querySelector('div.alert-danger')?.textContent).toContain('Passwords must match.');
  }));

  it('should disable submit button if form is invalid', fakeAsync(() => {
    component.model.email = 'test@example.com'; // Valid email
    component.model.password = 'short'; // Invalid password (assuming minlength 6)
    component.confirmPassword = 'short';
    fixture.detectChanges();
    tick(); // Allow for model changes to propagate

    const nameInput = fixture.nativeElement.querySelector('input[name="name"]');
    nameInput.value = ''; // Name is required
    nameInput.dispatchEvent(new Event('input'));
    nameInput.dispatchEvent(new Event('blur'));

    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTruthy();
  }));

  it('should disable submit button if passwords do not match', fakeAsync(() => {
    component.model.name = 'Test User';
    component.model.email = 'test@example.com';
    component.model.password = 'password123';
    component.confirmPassword = 'passwordMISMATCH'; // Passwords don't match
    fixture.detectChanges();
    tick();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTruthy();
  }));


  it('should call UsersService.postUser and show success message on successful registration', fakeAsync(() => {
    spyOn(usersService, 'postUser').and.callThrough();
    spyOn(router, 'navigate').and.stub(); // Spy even if not used yet

    component.model.name = 'New User';
    component.model.email = 'newuser@example.com';
    component.model.password = 'password123';
    component.confirmPassword = 'password123';
    fixture.detectChanges();

    const registerButton = fixture.nativeElement.querySelector('button[type="submit"]');
    registerButton.click();
    tick(); // Process async operations

    expect(usersService.postUser).toHaveBeenCalledWith(component.model);
    expect(component.registrationSuccess).toBeTrue();
    expect(component.registrationError).toBeNull();
    // Check if form is reset
    expect(component.model.name).toBe('');
    expect(component.model.email).toBe('');
    expect(component.model.password).toBe('');
    expect(component.confirmPassword).toBe('');

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.alert-success')?.textContent).toContain('Registration successful!');
    // expect(router.navigate).toHaveBeenCalledWith(['/login']); // Uncomment if auto-navigation is added
  }));

  it('should display error message if email already exists (409)', fakeAsync(() => {
    spyOn(usersService, 'postUser').and.callThrough();

    component.model.name = 'Existing User';
    component.model.email = 'existing@example.com';
    component.model.password = 'password123';
    component.confirmPassword = 'password123';
    fixture.detectChanges();

    const registerButton = fixture.nativeElement.querySelector('button[type="submit"]');
    registerButton.click();
    tick();

    expect(usersService.postUser).toHaveBeenCalled();
    expect(component.registrationSuccess).toBeFalse();
    expect(component.registrationError).toContain('User with this email already exists');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.alert-danger')?.textContent).toContain('User with this email already exists');
  }));

  it('should display generic error message for other API errors (e.g., 500)', fakeAsync(() => {
    spyOn(usersService, 'postUser').and.callThrough();

    component.model.name = 'Error User';
    component.model.email = 'error@example.com';
    component.model.password = 'password123';
    component.confirmPassword = 'password123';
    fixture.detectChanges();

    const registerButton = fixture.nativeElement.querySelector('button[type="submit"]');
    registerButton.click();
    tick();

    expect(usersService.postUser).toHaveBeenCalled();
    expect(component.registrationSuccess).toBeFalse();
    expect(component.registrationError).toContain('Internal Server Error');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.alert-danger')?.textContent).toContain('Internal Server Error');
  }));
});

// Dummy component for RouterTestingModule
class DummyLoginComponent {}
