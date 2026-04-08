import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastController = inject(ToastController);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError(async (error) => {
      let message = 'An error occurred';

      if (error.error) {
        // Handle Taiga API error format
        if (typeof error.error === 'object') {
          const errorMessages: string[] = [];
          for (const key in error.error) {
            if (Array.isArray(error.error[key])) {
              errorMessages.push(...error.error[key]);
            } else if (typeof error.error[key] === 'string') {
              errorMessages.push(error.error[key]);
            }
          }
          if (errorMessages.length > 0) {
            message = errorMessages.join(', ');
          } else if (error.error._error_message) {
            message = error.error._error_message;
          }
        } else if (typeof error.error === 'string') {
          message = error.error;
        }
      }

      if (error.status === 401) {
        message = 'Session expired. Please login again.';
        await authService.logout();
        router.navigate(['/login']);
      } else if (error.status === 403) {
        message = 'You do not have permission to perform this action';
      } else if (error.status === 404) {
        message = 'Resource not found';
      } else if (error.status === 0) {
        message = 'Network error. Please check your connection.';
      }

      const toast = await toastController.create({
        message,
        duration: 3000,
        position: 'bottom',
        color: 'danger',
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel'
          }
        ]
      });
      await toast.present();

      return throwError(() => error);
    })
  );
};
