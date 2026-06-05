import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { sectionGuard } from '@core/guards/section.guard';
import { AuthService } from '@core/services/auth.service';

// Land on the first section the user is allowed to see.
const firstSectionRedirect = (): string => {
  const [first] = inject(AuthService).sections();
  return first ? `/${first}` : '/unauthorized';
};

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('@features/auth/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('@features/auth/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('@features/auth/unauthorized/unauthorized.component').then((m) => m.UnauthorizedComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: 'products',
        canActivate: [sectionGuard],
        data: { section: 'products' },
        loadComponent: () =>
          import('@features/products/products-list/products-list.component').then((m) => m.ProductsListComponent),
      },
      {
        path: 'users',
        canActivate: [sectionGuard],
        data: { section: 'users' },
        loadComponent: () =>
          import('@features/users/users-list/users-list.component').then((m) => m.UsersListComponent),
      },
      {
        path: 'profiles',
        canActivate: [sectionGuard],
        data: { section: 'profiles' },
        loadComponent: () =>
          import('@features/profiles/profiles-list/profiles-list.component').then((m) => m.ProfilesListComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: firstSectionRedirect },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
