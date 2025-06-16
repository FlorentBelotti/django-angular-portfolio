import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPersonalInfosComponent } from './admin-personal-infos.component';

describe('AdminPersonalInfosComponent', () => {
  let component: AdminPersonalInfosComponent;
  let fixture: ComponentFixture<AdminPersonalInfosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPersonalInfosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPersonalInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
