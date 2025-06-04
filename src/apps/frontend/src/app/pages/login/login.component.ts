import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf, etc.
import { Router, RouterLink } from '@angular/router'; // Import Router and RouterLink
import { UsersService } from '../../api/api/users.service'; // Adjusted path

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink], // Add FormsModule, CommonModule, and RouterLink
})
export class LoginComponent {
  email = '';
  password = ''; // Password will be collected but not sent to API for now
  loginError: string | null = null;

  constructor(private usersService: UsersService, private router: Router) {}

  onSubmit(): void {
    this.loginError = null;

    if (!this.email) {
      this.loginError = 'Email is required to attempt login.';
      return;
    }

    // Using email as userId for getUser - this is a workaround
    this.usersService.getUser(this.email).subscribe({
      next: (user) => {
        console.log('User found (pseudo-login successful):', user);
        // TODO: Implement actual session management/token handling later if API supports it
        // For now, navigate to task list (home)
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
