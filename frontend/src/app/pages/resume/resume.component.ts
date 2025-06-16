import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkExperienceService } from '../../services/work-experience.service';
import { WorkExperience } from '../../interfaces/work-experience.model'
import { PersonalInfosService } from '../../services/personal-infos.service';
import { personalInfos } from '../../interfaces/personal-infos.model';

@Component({
  selector: 'app-resume',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.css'
})
export class ResumeComponent implements OnInit {

  // INIT
  constructor(
    protected workExperienceService: WorkExperienceService,
    protected personalInfosService: PersonalInfosService
  ) {}

  ngOnInit(): void {
    this.loadExperiences();
    this.loadPersonalInfos();
  }

  // DISPLAY

  personalInfos: personalInfos | null = null;

  loadPersonalInfos(): void {
    this.personalInfosService.get().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.personalInfos = data[0];
        }
      },
      error: (error) => {
        console.error('Error loading profile', error);
      }
    });
  }

  experiences_list: WorkExperience[] = [];

  loadExperiences(): void {
    this.workExperienceService.get().subscribe({
      next: (data) => {
        this.experiences_list = data;
      },
      error: (error) => {
        console.error('Error loading experiences', error);
      }
    });
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return 'Present';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
}
