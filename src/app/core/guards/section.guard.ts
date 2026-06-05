import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SectionSlug } from '../models';

// Requires route.data.section to be in the user's granted sections.
export const sectionGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const required = route.data['section'] as SectionSlug | undefined;
  if (!required || inject(AuthService).hasSection(required)) return true;
  return router.createUrlTree(['/unauthorized']);
};
