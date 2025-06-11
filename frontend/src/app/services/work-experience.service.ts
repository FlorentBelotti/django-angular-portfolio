import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkExperience } from '../interfaces/work-experience.model';
import { BaseAdminService } from './base-admin.service';
import { AdminAuthService } from './admin-auth.service';

@Injectable({
  providedIn: 'root'
})
export class WorkExperienceService extends BaseAdminService {
  
  // UTILS
  private apiUrl = 'http://localhost:8000/api/resume/work-experience/';
  
  constructor(
    // Give every parameters of BaseAdminService constructor,
    // Override : redefine parent,
    // Protcted : inherit between class.
    protected override http: HttpClient,
    protected override adminAuthService: AdminAuthService
  ) { 
    // Calling BaseAdminService constructor with current class parameters (to ask)
    super(http, adminAuthService);
  }

  // GETTER
  getWorkExperiences(): Observable<WorkExperience[]> {
    return this.http.get<WorkExperience[]>(this.apiUrl);
  }
  
  // SETTERS
  addWorkExperience(experience: WorkExperience): Observable<WorkExperience> {
    return this.executeAdminServicesOperation(() => {

      return this.http.post<WorkExperience>(this.apiUrl, experience, { 
        withCredentials: true 
      });
    })
  }
}