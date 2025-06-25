import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProjectService } from '../../../services/project.service';
import { Project, ProjectImage } from '../../../interfaces/project.model';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-projects.component.html',
  styleUrl: './admin-projects.component.css'
})
export class AdminProjectsComponent implements OnInit {

  // UTILS
  ProjectForm!: FormGroup;

  // Process validation
  isSubmitted = false;
  isSuccess = false;
  successMessage = '';
  
  // Error management
  errorMessage = '';

  // Projects list
  projects_list: Project[] = [];

  // Deletion
  deleteConfirmationId: number | null = null;
  
  // Edition
  isEditMode = false;
  currentEditId: number | null = null;

  // Modal
  isModalOpen = false;

  // Images management
  selectedFiles: File[] = [];
  imagePreviewUrls: string[] = [];

  constructor(
    protected formBuilder: FormBuilder,
    protected projectService: ProjectService
  ) {}

  // INIT
  ngOnInit(): void {
    this.initProjectForm();
    this.loadProjects();
  }

  // DISPLAY
  loadProjects(): void {
    this.projectService.get().subscribe({
      next: (data) => {
        this.projects_list = data;
      },
      error: (error) => {
        console.error('Error loading projects', error);
      }
    });
  }

  formatDate(date: string | null | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }

  openModal(): void {
    this.isModalOpen = true;
    this.isSubmitted = false;
    this.initProjectForm();
    this.successMessage = '';
    this.errorMessage = '';
    this.clearImageSelection();
    document.body.classList.add('modal-open');
  }
  
  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.currentEditId = null;
    this.errorMessage = '';
    this.clearImageSelection();
    document.body.classList.remove('modal-open');
  }

  // FORM
  initProjectForm(): void {
    this.ProjectForm = this.formBuilder.group({
      type: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      technologies: ['', Validators.required],
      github_link: [''],
      demo_link: [''],
      school_name: [''],
      company_name: ['']
    });
  }

  // IMAGE MANAGEMENT
  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = Array.from(input.files);
      this.generateImagePreviews();
    }
  }

  generateImagePreviews(): void {
    this.imagePreviewUrls = [];
    this.selectedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrls.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  clearImageSelection(): void {
    this.selectedFiles = [];
    this.imagePreviewUrls = [];
    const fileInput = document.getElementById('images') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  removeImage(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviewUrls.splice(index, 1);
  }

  deleteProjectImage(imageId: number, projectId: number): void {
    this.projectService.deleteImage(imageId).subscribe({
      next: () => {
        this.successMessage = 'Image successfully deleted.';
        this.loadProjects();
      },
      error: (error) => {
        this.errorMessage = '[ERROR]: Deleting image.';
        console.error(this.errorMessage, error);
      }
    });
  }

  // EDIT
  editProject(project: Project): void {
    this.isEditMode = true;
    this.currentEditId = project.id; // Maintenant project.id est toujours number
    this.successMessage = '';
    this.errorMessage = '';
    
    const projectDate = project.date ? new Date(project.date).toISOString().split('T')[0] : '';
    
    // Populate form
    this.ProjectForm.patchValue({
      type: project.type,
      title: project.title,
      description: project.description,
      date: projectDate,
      technologies: project.technologies,
      github_link: project.github_link || '',
      demo_link: project.demo_link || '',
      school_name: project.school_name || '',
      company_name: project.company_name || ''
    });
    
    this.isModalOpen = true;
    document.body.classList.add('modal-open');
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.errorMessage = '';

    // Form group verification
    if (this.ProjectForm.invalid)
      return;

    const projectFormData = { ...this.ProjectForm.value };

    if (this.isEditMode && this.currentEditId) {
      // Update existing project
      this.projectService.update(this.currentEditId, projectFormData).subscribe({
        next: (response) => {
          // Vérification de sécurité supplémentaire
          if (response.id) {
            this.uploadImages(response.id);
          } else {
            this.errorMessage = '[ERROR]: Invalid response from server.';
          }
        },
        error: (error) => {
          this.errorMessage = '[ERROR]: Updating project.';
          console.error(this.errorMessage, error);
        }
      });
    } else {
      // Add new project
      this.projectService.add(projectFormData).subscribe({
        next: (response) => {
          // Vérification de sécurité supplémentaire
          if (response.id) {
            this.uploadImages(response.id);
          } else {
            this.errorMessage = '[ERROR]: Invalid response from server.';
          }
        },
        error: (error) => {
          this.errorMessage = '[ERROR]: Adding project.';
          console.error(this.errorMessage, error);
        }
      });
    }
  }

  uploadImages(projectId: number): void {
    if (this.selectedFiles.length === 0) {
      this.successMessage = this.isEditMode ? 
        'Project successfully updated.' : 
        'Project successfully added.';
      this.closeModal();
      this.loadProjects();
      return;
    }

    let uploadedCount = 0;
    const totalFiles = this.selectedFiles.length;

    this.selectedFiles.forEach((file, index) => {
      const formData = new FormData();
      formData.append('project', projectId.toString());
      formData.append('image', file);
      formData.append('description', `Image ${index + 1}`);
      formData.append('order', index.toString());

      this.projectService.addImage(formData).subscribe({
        next: () => {
          uploadedCount++;
          if (uploadedCount === totalFiles) {
            this.successMessage = this.isEditMode ? 
              'Project and images successfully updated.' : 
              'Project and images successfully added.';
            this.closeModal();
            this.loadProjects();
          }
        },
        error: (error) => {
          this.errorMessage = '[ERROR]: Uploading images.';
          console.error(this.errorMessage, error);
        }
      });
    });
  }

  // DELETION
  confirmDelete(id: number): void {
    this.deleteConfirmationId = id;
  }
  
  cancelDelete(): void {
    this.deleteConfirmationId = null;
  }
  
  deleteProject(id: number): void {
    this.projectService.delete(id).subscribe({
      next: () => {
        this.deleteConfirmationId = null;
        this.successMessage = 'Project successfully deleted.';
        
        // If deleting currently edited project, reset form
        if (this.currentEditId === id) {
          this.isEditMode = false;
          this.currentEditId = null;
          this.initProjectForm();
        }
        
        this.loadProjects();
      },
      error: (error) => {
        this.errorMessage = '[ERROR]: Deleting project.';
        console.error(this.errorMessage, error);
      }
    });
  }
}