import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Education } from '../interfaces/education.model';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  
  // UTILS
  private apiUrl = 'http://localhost:8000/api/resume/education/';
  
  constructor(private http: HttpClient) { }

  // GETTER
  get(): Observable<Education[]> {
    return this.http.get<Education[]>(this.apiUrl);
  }
  
  getById(id: number): Observable<Education> {
    return this.http.get<Education>(`${this.apiUrl}${id}/`);
  }

  // SETTER
  add(experience: Education): Observable<Education> {
    return this.http.post<Education>(this.apiUrl, experience);
  }

  update(id: number, experience: Education): Observable<Education> {
    return this.http.put<Education>(`${this.apiUrl}${id}/`, experience);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}