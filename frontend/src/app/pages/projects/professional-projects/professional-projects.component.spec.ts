import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalProjectsComponent } from './professional-projects.component';

describe('ProfessionalProjectsComponent', () => {
  let component: ProfessionalProjectsComponent;
  let fixture: ComponentFixture<ProfessionalProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessionalProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
