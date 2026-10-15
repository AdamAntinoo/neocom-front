import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from './session.service';

/**
 * LOGIN-001 — guarded pages require `neocom_access`.
 * Missing or expired (browser dropped Max-Age) → write `neocom_return`, go to login.
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);
  if (session.hasAccess()) {
    return true;
  }
  session.setReturnUrl(state.url);
  return router.createUrlTree(['/login']);
};
