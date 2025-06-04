import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf, etc.
import { UsersService } from '../../api/api/users.service'; // Adjusted path
import { UserPostRequestDto } from '../../api/model/user-post-request-dto'; // Adjusted path
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule], // Add FormsModule and CommonModule
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

  constructor(private usersService: UsersService, private router: Router) {}

  onSubmit(): void {
    this.registrationError = null;
    this.registrationSuccess = false;

    if (this.model.password !== this.confirmPassword) {
      this.registrationError = 'Passwords must match.';
      return;
    }

    this.usersService.postUser(this.model).subscribe({
      next: (response) => {
        console.log('User registered successfully', response);
        this.registrationSuccess = true;
        // Optionally redirect to login page or show a success message
        // For now, just show a success message and clear the form
        this.model = { name: '', email: '', password: '' };
        this.confirmPassword = '';
        // Consider redirecting to login:
        // this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration failed', error);
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
