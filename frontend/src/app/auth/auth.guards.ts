import {Router} from "@angular/router";
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  // Redirect to login page
  return router.parseUrl('auth/login');
}

// Put more auth guards (i.e. authorization) here
