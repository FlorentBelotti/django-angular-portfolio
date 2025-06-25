import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project, ProjectImage } from '../interfaces/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  
  // UTILS
  private apiUrl = 'http://localhost:8000/api/projects/projects/';
  private imageApiUrl = 'http://localhost:8000/api/projects/project-images/';
  
  constructor(private http: HttpClient) { }

  // PROJECT METHODS
  get(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }
  
  getById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}${id}/`);
  }

  add(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  update(id: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}${id}/`, project);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`);
  }

  // PROJECT IMAGE METHODS
  addImage(formData: FormData): Observable<ProjectImage> {
    return this.http.post<ProjectImage>(this.imageApiUrl, formData);
  }

  updateImage(id: number, formData: FormData): Observable<ProjectImage> {
    return this.http.put<ProjectImage>(`${this.imageApiUrl}${id}/`, formData);
  }

  deleteImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.imageApiUrl}${id}/`);
  }
}