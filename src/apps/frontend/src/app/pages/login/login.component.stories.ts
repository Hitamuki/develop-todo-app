
import type { Meta, StoryObj } from '@storybook/angular';
import { fn } from '@storybook/test';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

// Mock AuthService
const mockAuthService = {
  login: fn().mockImplementation((credentials) => {
    if (credentials.email === 'test@example.com' && credentials.password === 'password') {
      return of({ token: 'fake-token' });
    }
    return throwError(() => new Error('Invalid credentials'));
  }),
};

const meta: Meta<LoginComponent> = {
  title: 'Pages/Login',
  component: LoginComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (story) => ({
      ...story(),
      moduleMetadata: {
        imports: [RouterTestingModule, BrowserAnimationsModule],
        providers: [{ provide: AuthService, useValue: mockAuthService }],
      },
    }),
  ],
};

export default meta;
type Story = StoryObj<LoginComponent>;

export const Default: Story = {
  args: {},
};

export const InvalidCredentials: Story = {
    args: {},
    play: async ({ canvasElement, componentInstance }) => {
        componentInstance.loginForm.setValue({
            email: 'wrong@example.com',
            password: 'wrongpassword'
        });
        componentInstance.onSubmit();
    }
};

export const WithValues: Story = {
    args: {},
    play: async ({ canvasElement, componentInstance }) => {
        componentInstance.loginForm.setValue({
            email: 'test@example.com',
            password: 'password'
        });
    }
}
