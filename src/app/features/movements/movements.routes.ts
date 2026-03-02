import { Routes } from '@angular/router';

export const MOVEMENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./movement-list/movement-list.component').then(
        (m) => m.MovementListComponent
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./movement-create/movement-create.component').then(
        (m) => m.MovementCreateComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./movement-edit/movement-edit.component').then(
        (m) => m.MovementEditComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./movement-detail/movement-detail.component').then(
        (m) => m.MovementDetailComponent
      ),
  },
];
