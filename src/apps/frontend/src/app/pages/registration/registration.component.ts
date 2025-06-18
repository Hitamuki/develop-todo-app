import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserPostRequestDto } from '../../api';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterLink, 
    MatInputModule, 
    MatFormFieldModule, 
    MatButtonModule, 
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  errorMessage: string | null = null;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      name: [''],
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
      
      if (formValues.name) {
        userData.name = formValues.name;
      }

      this.authService.register(userData).subscribe({
        next: () => {
          // Navigation to login is handled by AuthService
        },
        error: (err) => {
          console.error('Registration failed:', err);
          if (err.status === 400 || err.status === 409) {
            this.errorMessage = 'Registration failed. The email may already be in use or the data is invalid.';
          } else if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
          }
        }
      });
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }
}
