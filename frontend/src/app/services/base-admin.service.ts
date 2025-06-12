import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AdminAuthService } from './admin-auth.service';
import { switchMap } from 'rxjs/operators';

@Injectable()
export abstract class BaseAdminService {
  
  constructor(
    protected http: HttpClient,
    protected adminAuthService: AdminAuthService
  ) { }
  
  // TO ASK : is using a <T> to allow every kind of Observable a good practice ?
  protected executeAdminServicesOperation<T>(operation: (headers?: HttpHeaders) => Observable<T>): Observable<T> {
    
    // AUTHENTICATION + CSRF (admin-auth.service.ts)
    return this.adminAuthService.adminGuardAccess().pipe(
      switchMap(result => {
        if (!result.access) {
          return throwError(() => new Error('[WARNING]: Unauthorized, Only admin users can perform this operation'));
        }
        
        // Pass the header
        return operation(result.headers);
      })
    );
  }
}