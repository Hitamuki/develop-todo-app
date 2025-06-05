import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Added ReactiveFormsModule
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // For Material animations

import { RegisterComponent } from './register.component';
import { UsersService } from '../../api/api/users.service';
import { UserPostRequestDto } from '../../api/model/user-post-request-dto';

// Material Modules are already imported by the standalone RegisterComponent
// No need to import MatCardModule, MatFormFieldModule etc. here again for TestBed
// unless a specific override or additional configuration is needed for testing.

// Mock UsersService (remains the same)
class MockUsersService {
  postUser(dto: UserPostRequestDto) {
    if (dto.email === 'existing@example.com') {
      return throwError(() => ({ status: 409, error: { message: 'User with this email already exists' } }));
    }
    if (dto.email === 'error@example.com') {
      return throwError(() => ({ status: 500, error: { message: 'Internal Server Error' } }));
    }
    if (dto.email && dto.password) {
      return of({ id: dto.email, name: dto.name, email: dto.email });
    }
    return throwError(() => ({ status: 400, error: { message: 'Bad Request' } }));
  }
}

// Dummy component for RouterTestingModule (remains the same)
class DummyLoginComponent {}

describe('RegisterComponent with Angular Material', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let usersService: UsersService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterComponent, // Standalone, imports its own Material modules
        FormsModule,
        // ReactiveFormsModule, // If Material components internally need it
        CommonModule,
        RouterTestingModule.withRoutes([
           { path: 'login', component: DummyLoginComponent {} }
        ]),
        HttpClientTestingModule,
        NoopAnimationsModule, // For Material animations
      ],
      providers: [
        { provide: UsersService, useClass: MockUsersService },
        { provide: ActivatedRoute, useValue: {} }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render registration form with Material components', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-card-title')?.textContent).toContain('Register');
    expect(compiled.querySelector('input[matInput][name="name"]')).toBeTruthy();
    expect(compiled.querySelector('input[matInput][name="email"]')).toBeTruthy();
    expect(compiled.querySelector('input[matInput][name="password"]')).toBeTruthy();
    expect(compiled.querySelector('input[matInput][name="confirmPassword"]')).toBeTruthy();
    expect(compiled.querySelector('button[mat-raised-button][type="submit"]')).toBeTruthy();
  });

  it('should show Material validation error if passwords do not match on submit', fakeAsync(() => {
    component.model.name = 'Test User';
    component.model.email = 'test@example.com';
    component.model.password = 'password123';
    component.confirmPassword = 'password456'; // Mismatch

    // Mock the confirmPasswordField state for mat-error testing
    component.confirmPasswordField = { invalid: false, dirty: true, touched: true, errors: null, valid: true };
    // Mock the overall form state for the specific error condition
    component.registerForm = { submitted: true } as any; // Simulate form submission for the specific error

    fixture.detectChanges();

    const registerButton = fixture.nativeElement.querySelector('button[mat-raised-button][type="submit"]');
    registerButton.click(); // Attempt to submit
    tick();
    fixture.detectChanges(); // Update view with error

    // Check component state first
    expect(component.registrationError).toBe('Passwords must match.');

    // Then check DOM for mat-error related to password mismatch
    // The error message "Passwords must match." is now expected on the confirmPassword field's mat-error
    // when registerForm.submitted && model.password !== confirmPassword && confirmPasswordField.valid
    const confirmPasswordGroup = fixture.nativeElement.querySelectorAll('mat-form-field')[3]; // Assuming it's the 4th field
    const matError = confirmPasswordGroup.querySelector('mat-error');
    expect(matError?.textContent?.trim()).toBe('Passwords must match.');
  }));

  it('should disable submit button if form is invalid (e.g. name missing)', fakeAsync(() => {
    component.model.email = 'test@example.com';
    component.model.password = 'password123';
    component.confirmPassword = 'password123';
    // Name is missing (model.name is '')
    fixture.detectChanges();
    tick();

    const submitButton = fixture.nativeElement.querySelector('button[mat-raised-button][type="submit"]');
    // Manually trigger form validation state for testing disabled button
    component.registerForm = { invalid: true } as any;
    fixture.detectChanges();
    expect(submitButton.disabled).toBeTruthy();
  }));

  it('should disable submit button if passwords do not match', fakeAsync(() => {
    component.model.name = 'Test User';
    component.model.email = 'test@example.com';
    component.model.password = 'password123';
    component.confirmPassword = 'passwordMISMATCH'; // Passwords don't match
    fixture.detectChanges();
    tick();

    const submitButton = fixture.nativeElement.querySelector('button[mat-raised-button][type="submit"]');
    expect(submitButton.disabled).toBeTruthy(); // This relies on the [disabled] binding in the template
  }));

  it('should call UsersService.postUser and show success message on successful registration', fakeAsync(() => {
    spyOn(usersService, 'postUser').and.callThrough();
    spyOn(router, 'navigate').and.stub();

    component.model.name = 'New User';
    component.model.email = 'newuser@example.com';
    component.model.password = 'password123';
    component.confirmPassword = 'password123';
    fixture.detectChanges();

    // Ensure form is valid for submission
    component.registerForm = { invalid: false } as any;
    fixture.detectChanges();


    const registerButton = fixture.nativeElement.querySelector('button[mat-raised-button][type="submit"]');
    expect(registerButton.disabled).toBeFalsy(); // Button should be enabled
    registerButton.click();
    tick();

    expect(usersService.postUser).toHaveBeenCalledWith(component.model);
    expect(component.registrationSuccess).toBeTrue();
    expect(component.registrationError).toBeNull();
    expect(component.model.name).toBe(''); // Form reset
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div.alert.alert-success')?.textContent).toContain('Registration successful!');
  }));

  it('should display error message in alert div if email already exists (409)', fakeAsync(() => {
    spyOn(usersService, 'postUser').and.callThrough();

    component.model.name = 'Existing User';
    component.model.email = 'existing@example.com';
    component.model.password = 'password123';
    component.confirmPassword = 'password123';
     // Ensure form is valid for submission
    component.registerForm = { invalid: false } as any;
    fixture.detectChanges();

    const registerButton = fixture.nativeElement.querySelector('button[mat-raised-button][type="submit"]');
    registerButton.click();
    tick();

    expect(usersService.postUser).toHaveBeenCalled();
    expect(component.registrationSuccess).toBeFalse();
    expect(component.registrationError).toContain('User with this email already exists');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div.alert.alert-danger')?.textContent).toContain('User with this email already exists');
  }));

  it('should display generic error message in alert div for other API errors (e.g., 500)', fakeAsync(() => {
    spyOn(usersService, 'postUser').and.callThrough();

    component.model.name = 'Error User';
    component.model.email = 'error@example.com';
    component.model.password = 'password123';
    component.confirmPassword = 'password123';
     // Ensure form is valid for submission
    component.registerForm = { invalid: false } as any;
    fixture.detectChanges();

    const registerButton = fixture.nativeElement.querySelector('button[mat-raised-button][type="submit"]');
    registerButton.click();
    tick();

    expect(usersService.postUser).toHaveBeenCalled();
    expect(component.registrationSuccess).toBeFalse();
    expect(component.registrationError).toContain('Internal Server Error');
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div.alert.alert-danger')?.textContent).toContain('Internal Server Error');
  }));

  it('should have a link to the login page in mat-card-actions', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const loginLink = compiled.querySelector('mat-card-actions a[routerLink="/login"]');
    expect(loginLink).toBeTruthy();
    expect(loginLink?.textContent).toContain('Login here');
  });
});
