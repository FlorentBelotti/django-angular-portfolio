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
  getWorkExperiences(): Observable<WorkExperience[]> {
    return this.http.get<WorkExperience[]>(this.apiUrl);
  }
  
  // SETTER
  addWorkExperience(experience: WorkExperience): Observable<WorkExperience> {
    return this.http.post<WorkExperience>(this.apiUrl, experience);
  }
}