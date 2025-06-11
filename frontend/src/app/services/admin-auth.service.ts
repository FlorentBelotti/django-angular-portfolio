import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  constructor(private router: Router) { }

  // METHODS
  isAdminRoute(): boolean {
    return this.router.url.includes('admin')
    // return true;
  }

  // VERIFICATION
  checkAdminAccess(): boolean {
    return this.isAdminRoute();
  }

  // REDIRECTION
  adminGuardAccess(): boolean {
    const hasAccess = this.checkAdminAccess();
    if (!hasAccess) {
      this.router.navigate(['/']);
      console.warn('[WARNING]: Access to configuration prohibited, redirection to the home page')
    }
    return hasAccess;
  }
}
