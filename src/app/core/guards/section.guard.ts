import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isSectionSlug } from '../models';

// Requires route.data.section to be in the user's granted sections.
export const sectionGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const section = route.data['section'];
  if (!isSectionSlug(section) || inject(AuthService).hasSection(section)) return true;
  return router.createUrlTree(['/unauthorized']);
};
