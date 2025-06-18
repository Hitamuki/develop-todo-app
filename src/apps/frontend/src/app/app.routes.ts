import { LayoutComponent } from './layouts/layout/layout.component';
import type { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

/**
 * アプリケーションのルート定義
 */
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/registration/registration.component').then(m => m.RegistrationComponent),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/task-list/task-list.component').then((m) => m.TaskListComponent),
        canActivate: [authGuard],
      },
    ],
  },
];
