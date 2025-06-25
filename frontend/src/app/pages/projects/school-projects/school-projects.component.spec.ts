import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolProjectsComponent } from './school-projects.component';

describe('SchoolProjectsComponent', () => {
  let component: SchoolProjectsComponent;
  let fixture: ComponentFixture<SchoolProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchoolProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchoolProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
