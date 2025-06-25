import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../interfaces/project.model';

@Component({
  selector: 'app-school-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './school-projects.component.html',
  styleUrl: './school-projects.component.css'
})
export class SchoolProjectsComponent implements OnInit {

  // INIT
  constructor(protected projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadSchoolProjects();
  }

  // DISPLAY
  schoolProjects: Project[] = [];

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

  formatDate(date: string | null | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }
}