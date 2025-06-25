import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../interfaces/project.model';

@Component({
  selector: 'app-professional-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professional-projects.component.html',
  styleUrl: './professional-projects.component.css'
})
export class ProfessionalProjectsComponent implements OnInit {

  // INIT
  constructor(protected projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProfessionalProjects();
  }

  // DISPLAY
  professionalProjects: Project[] = [];

  loadProfessionalProjects(): void {
    this.projectService.get().subscribe({
      next: (data) => {
        this.professionalProjects = data.filter(project => project.type === 'professional');
      },
      error: (error) => {
        console.error('Error loading professional projects', error);
      }
    });
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
}