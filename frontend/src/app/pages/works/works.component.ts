import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../interfaces/project.model';

@Component({
  selector: 'app-works',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './works.component.html',
  styleUrl: './works.component.css'
})
export class WorksComponent implements OnInit {

  // INIT
  constructor(protected projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadSchoolProjects();
    this.loadProfessionalProjects();
    this.loadSideProjects();
  }

  // DISPLAY
  schoolProjects: Project[] = [];
  professionalProjects: Project[] = [];
  sideProjects: Project[] = [];

  loadSchoolProjects(): void {
    this.projectService.get().subscribe({
      next: (data) => {
        this.schoolProjects = data.filter(project => project.type === 'school');
      },
      error: (error) => {
        console.error('Error loading school projects', error);
      }
    });
  }

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

  loadSideProjects(): void {
    this.projectService.get().subscribe({
      next: (data) => {
        this.sideProjects = data.filter(project => project.type === 'side');
      },
      error: (error) => {
        console.error('Error loading side projects', error);
      }
    });
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
}