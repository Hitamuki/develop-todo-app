import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // NgForm for #registerForm
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Added RouterLink
import { UsersService } from '../../api/api/users.service';
import { UserPostRequestDto } from '../../api/model/user-post-request-dto';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Optional

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'], // Keep or create
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink, // Added RouterLink
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule // Add if icons are used
  ],
})
export class RegisterComponent {
  model: UserPostRequestDto = {
    name: '',
    email: '',
    password: '',
  };
  confirmPassword = '';
  registrationError: string | null = null;
  registrationSuccess = false;

  // For accessing form controls in template's mat-error
  nameField: any;
  emailField: any;
  passwordField: any;
  confirmPasswordField: any;

  constructor(private usersService: UsersService, private router: Router) {}

  onSubmit(): void {
    this.registrationError = null;
    // this.registrationSuccess = false; // Keep success message until next attempt

    if (this.model.password !== this.confirmPassword) {
      this.registrationError = 'Passwords must match.';
      this.registrationSuccess = false; // Clear success on new error
      return;
    }

    this.usersService.postUser(this.model).subscribe({
      next: (response) => {
        console.log('User registered successfully', response);
        this.registrationSuccess = true;
        this.registrationError = null;
        // Clear form on success
        this.model = { name: '', email: '', password: '' };
        this.confirmPassword = '';
        // Reset form state as well if possible, or let ngModel handle it
        // this.registerForm.resetForm(); // Would need ViewChild for registerForm
      },
      error: (error) => {
        console.error('Registration failed', error);
        this.registrationSuccess = false;
        this.registrationError = 'Registration failed. Please try again.';
        if (error.error && typeof error.error.message === 'string') {
            this.registrationError = error.error.message;
        } else if (typeof error.message === 'string') {
            this.registrationError = error.message;
        }
      },
    });
  }
}
