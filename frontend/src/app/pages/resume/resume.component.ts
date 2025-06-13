import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkExperienceService } from '../../services/work-experience.service';
import { WorkExperience } from '../../interfaces/work-experience.model'

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
    protected workExperienceService: WorkExperienceService
  ) {}

  ngOnInit(): void {
    this.loadExperiences();
  }

  // WORK EXPERIENCES DISPLAY
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
