import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WorkExperienceService } from '../../../services/work-experience.service';

@Component({
  selector: 'app-admin-add-experiences',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-add-experiences.component.html',
  styleUrl: './admin-add-experiences.component.css'
})
export class AdminAddExperiencesComponent implements OnInit {

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

  constructor(
    protected formBuilder: FormBuilder,
    protected workExperienceService: WorkExperienceService
  ) {}

  // INIT

  // Class init
  ngOnInit(): void {
    this.initExperienceForm();
  }

  // Form init
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

    // SUBMISSION

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
        },
        error: (error) => {
          this.errorMessage = '[ERROR]: Adding experience.';
          console.error(this.errorMessage, error);
        }
      })
    }
}
