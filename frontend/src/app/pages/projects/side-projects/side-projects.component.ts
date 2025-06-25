import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../interfaces/project.model';

@Component({
  selector: 'app-side-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-projects.component.html',
  styleUrl: './side-projects.component.css'
})
export class SideProjectsComponent implements OnInit {

  // INIT
  constructor(protected projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadSideProjects();
  }

  // DISPLAY
  sideProjects: Project[] = [];

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