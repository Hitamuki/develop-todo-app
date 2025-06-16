import { LayoutComponent } from './layouts/layout/layout.component';
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
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        loadComponent: () => import('./pages/task-list/task-list.component').then((m) => m.TaskListComponent),
      },
    ],
  },
];
