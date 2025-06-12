import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CsrfManagementService } from '../services/csrf-management.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {

  // UTILS
  const router = inject(Router);
  const csrfService = inject(CsrfManagementService);

  // Check admin route
  const isAdminRoute = router.url.includes('admin');
  if (!isAdminRoute)
    return next(req);

  // Check for csrf in cookie
  if (csrfService.hasCsrfToken()) {
    const csrfToken = csrfService.getCsrfInCookie();
    const modifiedRequest = req.clone({
      withCredentials: true,
      headers: req.headers.set('X-CSRFToken', csrfToken)
    });
    return next(modifiedRequest);
  }

  // If not, try to fetch csrf
  return csrfService.fetchCsrfToken().pipe(
    catchError(error => {
      console.error('[ERROR]: Failed to get CSRF token', error);
      return throwError(() => new Error('CSRF token retrieval failed'));
    }),
    switchMap(() => {
      const csrfToken = csrfService.getCsrfInCookie();
      const modifiedReq = req.clone({
        withCredentials: true,
        headers: req.headers.set('X-CSRFToken', csrfToken)
      });
      return next(modifiedReq);
    })
  );
};
