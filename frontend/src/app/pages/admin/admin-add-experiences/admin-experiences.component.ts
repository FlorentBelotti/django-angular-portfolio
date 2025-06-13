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
  
  // Error management
    errorMessage = '';

  // Experiences list
    experiences_list: WorkExperience[] = [];

  // Deletion
    deleteConfirmationId: number | null = null;

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

    onSubmit(): void {
      this.isSubmitted = true;
      this.isSuccess = false;
      this.errorMessage = '';

      // From group verification
      if (this.ExperienceForm.invalid)
        return;

      // Dynamic fields management
      const experienceFormData = { ...this.ExperienceForm.value };
      if (experienceFormData.current)
        experienceFormData.end_date = null;

      this.workExperienceService.add(experienceFormData).subscribe({
        next: (response) => {
          this.isSuccess = true;
          this.ExperienceForm.reset();
          this.isSubmitted = false;

          // To check
          this.initExperienceForm();
          
          // Update work experience
          this.loadExperiences();
        },
        error: (error) => {
          this.errorMessage = '[ERROR]: Adding experience.';
          console.error(this.errorMessage, error);
        }
      })
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
        this.loadExperiences();
      },
      error: (error) => {
        this.errorMessage = '[ERROR]: Deleting experience.';
        console.error(this.errorMessage, error);
      }
    });
  }
}
