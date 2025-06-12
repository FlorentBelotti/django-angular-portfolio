import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CsrfManagementService {

  private csrfUrl = 'http://localhost:8000/api/csrf-token/';
  private isTokenFetched = false;

  constructor(private http: HttpClient) { }

  // METHODS

  // Get token from cookie
  private getCookie(name: string): string {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || '';
    }
    return '';
  }

  getCsrfInCookie(): string {
    return this.getCookie('csrftoken');
  }

  // Check token from frontend
  // '!' if there is a token, it's false.
  // '!!' if there is a token, it's true, because '!' negate '!'.
  hasCsrfToken(): boolean {
    return this.isTokenFetched || !!this.getCsrfInCookie();
  }

  // API

  // Get token from backend
  // pipe: allow to apply operator to an Observable (container for other function)
  // tap: create a secondary action that does not impact the primary action.
  fetchCsrfToken(): Observable<any> {
    return this.http.get(this.csrfUrl, { withCredentials: true }).pipe(
        tap(() => {
          this.isTokenFetched = true;
        })
      );
  }
}
