import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(
            (m) => m.DASHBOARD_ROUTES
          ),
      },
      {
        path: 'movements',
        loadChildren: () =>
          import('./features/movements/movements.routes').then(
            (m) => m.MOVEMENTS_ROUTES
          ),
      },
      {
        path: 'workouts',
        loadChildren: () =>
          import('./features/workouts/workouts.routes').then(
            (m) => m.WORKOUTS_ROUTES
          ),
      },
      {
        path: 'programs',
        loadChildren: () =>
          import('./features/programs/programs.routes').then(
            (m) => m.PROGRAMS_ROUTES
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'auth' },
];
