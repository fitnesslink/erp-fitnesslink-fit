import { Routes } from '@angular/router';

export const PROGRAMS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./program-list/program-list.component').then(
        (m) => m.ProgramListComponent
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./program-create/program-create.component').then(
        (m) => m.ProgramCreateComponent
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./program-edit/program-edit.component').then(
        (m) => m.ProgramEditComponent
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./program-detail/program-detail.component').then(
        (m) => m.ProgramDetailComponent
      ),
  },
];
