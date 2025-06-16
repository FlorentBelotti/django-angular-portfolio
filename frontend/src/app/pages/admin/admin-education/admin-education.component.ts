import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Education } from '../../../interfaces/education.model';
import { EducationService } from '../../../services/education.service';

@Component({
  selector: 'app-admin-education',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-education.component.html',
  styleUrl: './admin-education.component.css'
})
export class AdminEducationComponent implements OnInit {

  // UTILS

  EducationForm!: FormGroup;
  isSubmitted = false;
  isSuccess = false;
  successMessage = '';
  errorMessage = '';
  educations_list: Education[] = [];
  deleteConfirmationId: number | null = null;
  isEditMode = false;
  currentEditId: number | null = null;
  isModalOpen = false;

  // INIT

  constructor(
    protected formBuilder: FormBuilder,
    protected educationService: EducationService
  ) {}

  ngOnInit(): void {
    this.initEducationForm();
    this.loadEducations();
  }

  // FORM

  initEducationForm(): void {
    this.EducationForm = this.formBuilder.group({
      institution: ['', Validators.required],
      degree: ['', Validators.required],
      location: ['', Validators.required],
      field_of_study: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: [''],
      current: [false],
      description: ['', Validators.required]
    });

    // Dynamic field
    this.EducationForm.get('current')?.valueChanges.subscribe(value => {
      const endDateControl = this.EducationForm.get('end_date');
      if (value) {
        endDateControl?.disable();
        endDateControl?.setValue('');
      } else {
        endDateControl?.enable();
      }
    });
  }

  editEducation(education: Education): void {
    this.isEditMode = true;
    this.currentEditId = education.id;
    this.successMessage = '';
    this.errorMessage = '';

    const startDate = education.start_date ? new Date(education.start_date).toISOString().split('T')[0] : '';
    const endDate = education.end_date ? new Date(education.end_date).toISOString().split('T')[0] : '';
    this.EducationForm.patchValue({
      company: education.institution,
      position: education.degree,
      location: education.location,
      field_of_study: education.field_of_study,
      start_date: startDate,
      end_date: endDate,
      current: education.current,
      description: education.description
    });
    this.isModalOpen = true;
    document.body.classList.add('modal-open');
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.errorMessage = '';

    if (this.EducationForm.invalid)
      return;
    
    const educationFormData = {...this.EducationForm.value};
    if (educationFormData.current)
      educationFormData.end_date = null;

    if (this.isEditMode && this.currentEditId) {
      this.educationService.update(this.currentEditId, educationFormData).subscribe({
        next: (response) => {
          this.successMessage = '[SUCCESS]: Education successfully updated.';
          this.closeModal();
          this.loadEducations();
        },
        error: (error) => {
          this.errorMessage = '[ERROR]: Updating formation.';
          console.error(this.errorMessage, error);
        }
      });
    } else {
      this.educationService.add(educationFormData).subscribe({
        next: (response) => {
          this.successMessage = 'Experience successfully added.';
          this.closeModal();
          this.loadEducations();
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
    this.educationService.delete(id).subscribe({
      next: () => {
        this.deleteConfirmationId = null;
        this.successMessage = 'Formation successfully deleted.';
        
        // If deleting currently edited experience, reset form
        if (this.currentEditId === id) {
          this.isEditMode = false;
          this.currentEditId = null;
          this.initEducationForm();
        }
        this.loadEducations();
      },
      error: (error) => {
        this.errorMessage = '[ERROR]: Deleting experience.';
        console.error(this.errorMessage, error);
      }
    });
  }

  // DISPLAY

  loadEducations(): void {
    this.educationService.get().subscribe({
      next: (data) => {
        this.educations_list = data;
      },
      error: (error) => {
        console.error('Error loading educations', error);
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
    this.initEducationForm();
    this.successMessage = '';
    this.errorMessage = '';
    document.body.classList.add('modal-open');
  }

  cancelEdit(): void {
    this.closeModal();
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditMode = false;
    this.currentEditId = null;
    this.errorMessage = '';
    document.body.classList.remove('modal-open');
  }
}
