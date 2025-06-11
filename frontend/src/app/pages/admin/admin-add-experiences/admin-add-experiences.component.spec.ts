import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddExperiencesComponent } from './admin-add-experiences.component';

describe('AdminAddExperiencesComponent', () => {
  let component: AdminAddExperiencesComponent;
  let fixture: ComponentFixture<AdminAddExperiencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddExperiencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddExperiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
