import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms'; // NgForm for #loginForm
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UsersService } from '../../api/api/users.service';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon'; // Optional, for icons if needed

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'], // Keep or create this for custom styles
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule // Add if icons are used
  ],
})
export class LoginComponent { // No changes to the class logic itself for this step
  email = '';
  password = '';
  loginError: string | null = null;

  // For accessing form controls in template's mat-error
  // This is a bit of a workaround as ViewChild might be cleaner but requires more setup for simple cases
  emailField: any; // To bind #emailField="ngModel" to access its state
  passwordField: any; // To bind #passwordField="ngModel"

  constructor(private usersService: UsersService, private router: Router) {}

  onSubmit(): void {
    this.loginError = null;

    if (!this.email) {
      this.loginError = 'Email is required to attempt login.';
      return;
    }

    this.usersService.getUser(this.email).subscribe({
      next: (user) => {
        console.log('User found (pseudo-login successful):', user);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Login failed (user not found or API error):', error);
        this.loginError = 'Login failed. User not found or API error.';
         if (error.status === 404) {
            this.loginError = 'Login failed. User not found.';
        } else if (error.error && typeof error.error.message === 'string') {
            this.loginError = error.error.message;
        } else if (typeof error.message === 'string') {
            this.loginError = error.message;
        }
      },
    });
  }
}
