import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserPostRequestDto } from '../../api'; // Import the DTO

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup; // Definite assignment
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: [''], // Optional, maps to DTO's 'name'
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.registrationForm.valid) {
      const formValues = this.registrationForm.value;
      const userData: UserPostRequestDto = {
        email: formValues.email,
        password: formValues.password
      };
      // Add name to DTO if provided in the form
      if (formValues.name) {
        userData.name = formValues.name;
      }

      this.authService.register(userData).subscribe({
        next: () => {
          // Navigation to login is handled by AuthService
          // Optionally, show a success message here (e.g., using a toastr service)
          // For example: this.toastr.success('Registration successful! Please login.');
        },
        error: (err) => {
          console.error('Registration failed:', err);
          if (err.status === 400 || err.status === 409) { // 409 Conflict (e.g., email already exists)
            this.errorMessage = 'Registration failed. The email may already be in use or the data is invalid.';
          } else if (err.error && err.error.message) { // Check for backend error message
            this.errorMessage = err.error.message;
          }
           else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
          }
        }
      });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }
}
