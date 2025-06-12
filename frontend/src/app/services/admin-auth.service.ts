import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CsrfManagementService } from './csrf-management.service';
import { Observable, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  constructor(
    private router: Router,
    private csrfService: CsrfManagementService
  ) { }

  // METHODS
  isAdminRoute(): boolean {
    return this.router.url.includes('admin')
    // return true;
  }

  // ROUTE VERIFICATION
  checkAdminAccess(): boolean {
    return this.isAdminRoute();
  }

  // CSRF AUTHENTICATION
  CheckCsrfToken(): Observable<any> {
    if (this.csrfService.hasCsrfToken()) {
      return of({ success: '[SUCCESS]: CSRF token already available' });
    }
    
    return this.csrfService.fetchCsrfToken().pipe(
      tap(() => console.log('[SUCCESS]: CSRF token obtained')),
      catchError(error => {
        console.error('[ERROR]: Error fetching CSRF token', error);
        return of({ error: '[ERROR]: Failed to get CSRF token' });
      })
    );
  }

  // VERIFICATION
  adminGuardAccess(): Observable<{access: boolean, headers?: HttpHeaders}> {

    // Check route access
    const hasRouteAccess = this.checkAdminAccess();
    if (!hasRouteAccess) {
      this.router.navigate(['/']);
      console.warn('[WARNING]: Access to configuration prohibited, redirection to the home page');
      return of({access: false});
    }
    
    // Check CSRF token
    return this.CheckCsrfToken().pipe(
      tap(response => {
        if (response.error) {
          console.error('[ERROR]: CSRF token could not be obtained');
        } else {
          console.log('[SUCCESS]: Accessing admin configuration page with CSRF protection');
        }
      }),
      map(response => {
        if (response.error) {
          return {access: false};
        } else {

          // HEADER CREATION
          const headers = new HttpHeaders({
            'X-CSRFToken': this.csrfService.getCsrfInCookie()
          });

          return {access: true, headers};
        }
      })
    );
  }
}