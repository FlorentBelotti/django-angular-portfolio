import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { personalInfos } from '../interfaces/personal-infos.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonalInfosService {

  private apiUrl = 'http://localhost:8000/api/resume/personal-info/';

  constructor(private http: HttpClient) { }

  // GETTER
  get(): Observable<personalInfos[]> {
    return this.http.get<personalInfos[]>(this.apiUrl);
  }

  // SETTER
  create(personalInfo: personalInfos): Observable<personalInfos> {
    return this.http.post<personalInfos>(this.apiUrl, personalInfo);
  }

  update(id: number, personalInfo: personalInfos): Observable<personalInfos> {
    return this.http.put<personalInfos>(`${this.apiUrl}${id}/`, personalInfo);
  }

  createWithFormData(formData: FormData): Observable<personalInfos> {
    return this.http.post<personalInfos>(this.apiUrl, formData);
  }

  updateWithFormData(id: number, formData: FormData): Observable<personalInfos> {
    return this.http.put<personalInfos>(`${this.apiUrl}${id}/`, formData);
  }
}