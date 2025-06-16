import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkExperienceService } from '../../../services/work-experience.service';
import { WorkExperience } from '../../../interfaces/work-experience.model';

@Component({
  selector: 'app-admin-add-experiences',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-experiences.component.html',
  styleUrl: './admin-experiences.component.css'
})
export class AdminExperiencesComponent implements OnInit {

  // UTILS

  // '!' indicate that forms will be define before use.
  // FormGroup is a container that regroups every parts of my form,
  // Allow to follow the global state of the form with one action.
    ExperienceForm!: FormGroup;

  // Process validation
    isSubmitted = false;
    isSuccess = false;
    successMessage = '';
  
  // Error management
    errorMessage = '';

  // Experiences list
    experiences_list: WorkExperience[] = [];

  // Deletion
    deleteConfirmationId: number | null = null;
    
  // Edition
    isEditMode = false;
    currentEditId: number | null = null;

  // Modal
    isModalOpen = false;

  constructor(
    protected formBuilder: FormBuilder,
    protected workExperienceService: WorkExperienceService
  ) {}

  // INIT

  ngOnInit(): void {
    this.initExperienceForm();
    this.loadExperiences();
  }

  // DISPLAY

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

  openModal(): void {
    this.isModalOpen = true;
    this.isSubmitted = false;
    this.initExperienceForm();
    this.successMessage = '';
    this.errorMessage = '';
    document.body.classList.add('modal-open');
  }
  
  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.currentEditId = null;
    this.errorMessage = '';
    document.body.classList.remove('modal-open');
  }

  // FORM

  initExperienceForm(): void {
    // Each field is a different form control.
    this.ExperienceForm = this.formBuilder.group({
      company: ['', Validators.required],
      position: ['', Validators.required],
      location: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: [''],
      current: [false],
      description: ['', Validators.required]
    });
    
    // DYNAMIC FIELDS MANAGEMENT
    this.ExperienceForm.get('current')?.valueChanges.subscribe(value => {
      // End Date form control
      const endDateControl = this.ExperienceForm.get('end_date');

      if (value) {
        endDateControl?.disable();
        endDateControl?.setValue('');
      } else {
        endDateControl?.enable();
      }
    });
  }

  // EDIT

  editExperience(experience: WorkExperience): void {
    this.isEditMode = true;
    this.currentEditId = experience.id;
    this.successMessage = '';
    this.errorMessage = '';
    
    const startDate = experience.start_date ? new Date(experience.start_date).toISOString().split('T')[0] : '';
    const endDate = experience.end_date ? new Date(experience.end_date).toISOString().split('T')[0] : '';
    
    // Populate form
    this.ExperienceForm.patchValue({
      company: experience.company,
      position: experience.position,
      location: experience.location,
      start_date: startDate,
      end_date: endDate,
      current: experience.current,
      description: experience.description
    });
    
    this.isModalOpen = true;
    document.body.classList.add('modal-open');
  }
  
  cancelEdit(): void {
    this.closeModal();
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.errorMessage = '';

    // Form group verification
    if (this.ExperienceForm.invalid)
      return;

    // Dynamic fields management
    const experienceFormData = { ...this.ExperienceForm.value };
    if (experienceFormData.current)
      experienceFormData.end_date = null;

    if (this.isEditMode && this.currentEditId) {
      // Update existing experience
      this.workExperienceService.update(this.currentEditId, experienceFormData).subscribe({
        next: (response) => {
          this.successMessage = 'Experience successfully updated.';
          this.closeModal();
          this.loadExperiences();
        },
        error: (error) => {
          this.errorMessage = '[ERROR]: Updating experience.';
          console.error(this.errorMessage, error);
        }
      });
    } else {
      // Add new experience
      this.workExperienceService.add(experienceFormData).subscribe({
        next: (response) => {
          this.successMessage = 'Experience successfully added.';
          this.closeModal();
          this.loadExperiences();
        },
        error: (error) => {
          this.errorMessage = '[ERROR]: Adding experience.';
          console.error(this.errorMessage, error);
        }
      });
    }
  }

  // DELETION

  confirmDelete(id: number): void {
    this.deleteConfirmationId = id;
  }
  
  cancelDelete(): void {
    this.deleteConfirmationId = null;
  }
  
  deleteExperience(id: number): void {
    this.workExperienceService.delete(id).subscribe({
      next: () => {
        this.deleteConfirmationId = null;
        this.successMessage = 'Experience successfully deleted.';
        
        // If deleting currently edited experience, reset form
        if (this.currentEditId === id) {
          this.isEditMode = false;
          this.currentEditId = null;
          this.initExperienceForm();
        }
        
        this.loadExperiences();
      },
      error: (error) => {
        this.errorMessage = '[ERROR]: Deleting experience.';
        console.error(this.errorMessage, error);
      }
    });
  }
}