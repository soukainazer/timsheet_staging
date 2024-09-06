import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service'; 
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

//   if (authService.isAuthenticated()) {
//     return true;
//   } else {
//     router.navigate(['/login']);
//     return false;
//   }
// };

if (authService.isAuthenticated()) {
  const decodedToken = authService.getDecodedToken();
  const userRole = decodedToken?.role;

  // Check if the route has any roles defined
  const expectedRoles = route.data?.['roles'] as Array<string>;
  
  if (expectedRoles && expectedRoles.indexOf(userRole) === -1) {
    // If user role is not authorized, redirect to login or unauthorized page
    router.navigate(['/login']);
    return false;
  }
  return true;
} else {
  // If not authenticated, redirect to login
  router.navigate(['/login']);
  return false;
}
};