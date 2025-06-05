import type { Routes } from '@angular/router';

/**
 * アプリケーションのルート定義
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    children: [
      {
        path: 'home', // This might be the task list page
        loadComponent: () => import('./pages/task-list/task-list.component').then((m) => m.TaskListComponent),
      },
      // Potentially other child routes
    ],
  },
  // It's good practice to have a wildcard route for 404 pages
  // { path: '**', component: PageNotFoundComponent },
];
