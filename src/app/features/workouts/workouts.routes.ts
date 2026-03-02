import { Routes } from '@angular/router';

export const WORKOUTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./workout-list/workout-list.component').then(
        (m) => m.WorkoutListComponent
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./workout-create/workout-create.component').then(
        (m) => m.WorkoutCreateComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./workout-edit/workout-edit.component').then(
        (m) => m.WorkoutEditComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./workout-detail/workout-detail.component').then(
        (m) => m.WorkoutDetailComponent
      ),
  },
];
