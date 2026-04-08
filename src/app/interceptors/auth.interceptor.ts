import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, lastValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  return from(handleAuth(req, next, authService));
};

async function handleAuth(req: any, next: any, authService: AuthService) {
  // Skip auth for login and register endpoints
  if (req.url.includes('/auth') && !req.url.includes('/users/me')) {
    return lastValueFrom(next(req));
  }

  const token = await authService.getToken();
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return lastValueFrom(next(req));
}
