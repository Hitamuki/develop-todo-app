import { type ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { environment } from '../environments/environment';
import { authInterceptor } from './interceptors/auth.interceptor';
import { mockApiInterceptor } from './interceptors/mock-api.interceptor';
import { routes } from './app.routes';
import { BASE_PATH } from './api';
import { provideToastr } from 'ngx-toastr';

/**
 *
 */
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: BASE_PATH, useValue: environment.API_BASE_PATH },
    { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([
        ...(environment.mock ? [mockApiInterceptor] : []),
        authInterceptor,
      ]),
    ),
    provideToastr({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
      closeButton: true,
      progressBar: true,
      toastClass: 'ngx-toastr toast-bootstrap',
    }),
  ],
};
