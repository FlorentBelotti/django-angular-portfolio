import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkExperience } from '../interfaces/work-experience.model';

@Injectable({
  providedIn: 'root'
})
export class WorkExperienceService {
  
  // UTILS
  private apiUrl = 'http://localhost:8000/api/resume/work-experience/';
  
  constructor(private http: HttpClient) { }

  // GETTER
  get(): Observable<WorkExperience[]> {
    return this.http.get<WorkExperience[]>(this.apiUrl);
  }
  
  getById(id: number): Observable<WorkExperience> {
    return this.http.get<WorkExperience>(`${this.apiUrl}${id}/`);
  }

  // SETTER
  add(experience: WorkExperience): Observable<WorkExperience> {
    return this.http.post<WorkExperience>(this.apiUrl, experience);
  }

  update(id: number, experience: WorkExperience): Observable<WorkExperience> {
    return this.http.put<WorkExperience>(`${this.apiUrl}${id}/`, experience);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }
}