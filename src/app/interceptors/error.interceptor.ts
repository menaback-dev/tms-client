import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const detailMessage =
        err.error?.detail ?? 'A system error occurred. Please try again.';

      if (err.status === 401) {
        router.navigate(['/login']);
      } else {
        console.error('API Error Response:', detailMessage);
      }

      return throwError(() => err);
    })
  );
};