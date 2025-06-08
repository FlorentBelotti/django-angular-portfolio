import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDisclaimerComponent } from './admin-disclaimer.component';

describe('AdminDisclaimerComponent', () => {
  let component: AdminDisclaimerComponent;
  let fixture: ComponentFixture<AdminDisclaimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDisclaimerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
