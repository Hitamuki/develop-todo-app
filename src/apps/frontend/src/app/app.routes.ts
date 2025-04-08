import type { Routes } from '@angular/router';

/**
 * アプリケーションのルート定義
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: '',
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/task-list/task-list.component').then((m) => m.TaskListComponent),
      },
    ],
  },
];
