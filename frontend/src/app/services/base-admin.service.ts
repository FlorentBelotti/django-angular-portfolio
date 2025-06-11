import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AdminAuthService } from './admin-auth.service';

@Injectable()
export abstract class BaseAdminService {
  
  constructor(
    protected http: HttpClient,
    protected adminAuthService: AdminAuthService
  ) { }
  
  // TO ASK : is using a <T> to allow every kind of Observable a good practice ?
  protected executeAdminServicesOperation<T>(operation: () => Observable<T>): Observable<T> {
    
    // AUTHENTICATION (admin-auth.service.ts)
    if (!this.adminAuthService.adminGuardAccess()) {
      return throwError(() => new Error('Unauthorized: Only admin users can perform this operation'));
    }
    
    return operation();
  }
}