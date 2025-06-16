import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonalInfosService } from '../../../services/personal-infos.service';
import { personalInfos } from '../../../interfaces/personal-infos.model';

@Component({
  selector: 'app-admin-personal-infos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-personal-infos.component.html',
  styleUrl: './admin-personal-infos.component.css'
})
export class AdminPersonalInfosComponent implements OnInit {

  // UTILS
  PersonalInfosForm!: FormGroup;
  isSubmitted = false;
  isSuccess = false;
  isEditMode = false;
  successMessage = '';
  errorMessage = '';
  personalInfo: personalInfos | null = null;
  personalInfoId: number | null | undefined = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    protected formBuilder: FormBuilder,
    protected PersonalInfosService: PersonalInfosService
  ) {}

  ngOnInit(): void {
    this.initPersonalInfosForm();
    this.formAutoFill();
  }

  // No photo field
  initPersonalInfosForm(): void {
    this.PersonalInfosForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      title: ['', Validators.required],
      bio: ['', Validators.required],
      driver_licence: [''],
      linkedin: [''],
      github: ['']
    });
  }

  // PHOTO

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  // AUTOFILL
  formAutoFill(): void {
    this.PersonalInfosService.get().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.personalInfo = data[0];
          this.personalInfoId = data[0].id;
          this.isEditMode = true;
          this.editPersonalInfos(this.personalInfo);
          
          // Photo preview
          if (this.personalInfo.photo) {
            this.imagePreview = this.personalInfo.photo;
          }
        }
      },
      error: (error) => {
        console.error('Error loading personal info', error);
        this.errorMessage = 'Failed to load personal information.';
      }
    });
  }

  // FORM

  editPersonalInfos(personalInfos: personalInfos): void {
    this.isEditMode = true;
    this.PersonalInfosForm.patchValue({
      first_name: personalInfos.first_name,
      last_name: personalInfos.last_name,
      email: personalInfos.email,
      phone: personalInfos.phone,
      title: personalInfos.title,
      bio: personalInfos.bio,
      driver_licence: personalInfos.driver_licence,
      linkedin: personalInfos.linkedin,
      github: personalInfos.github,
    });
  }

  onSubmit(): void {
    this.isSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.PersonalInfosForm.invalid) {
      return;
    }

    const formData = new FormData();
    
    Object.keys(this.PersonalInfosForm.value).forEach(key => {
      formData.append(key, this.PersonalInfosForm.value[key]);
    });
    
    if (this.selectedFile) {
      formData.append('photo', this.selectedFile);
    }

    if (this.isEditMode && this.personalInfoId) {
      this.PersonalInfosService.updateWithFormData(this.personalInfoId, formData).subscribe({
        next: (response) => {
          this.successMessage = 'Personal information successfully updated.';
          this.isSuccess = true;
          this.personalInfo = response;
          if (response.photo) {
            this.imagePreview = response.photo;
          }
          setTimeout(() => {
            this.isSubmitted = false;
          }, 100);
        },
        error: (error) => {
          this.errorMessage = 'Error updating personal information.';
          this.isSuccess = false;
          console.error('Error updating personal info:', error);
          if (error.error) {
            console.error('Server error details:', error.error);
          }
        }
      });
    } else {
      this.PersonalInfosService.createWithFormData(formData).subscribe({
        next: (response) => {
          this.successMessage = 'Personal information successfully created.';
          this.isSuccess = true;
          this.isEditMode = true;
          this.personalInfo = response;
          this.personalInfoId = response.id;
          if (response.photo) {
            this.imagePreview = response.photo;
          }
          setTimeout(() => {
            this.isSubmitted = false;
          }, 100);
        },
        error: (error) => {
          this.errorMessage = 'Error creating personal information.';
          this.isSuccess = false;
          console.error('Error creating personal info:', error);
          if (error.error) {
            console.error('Server error details:', error.error);
          }
        }
      });
    }
  }
}