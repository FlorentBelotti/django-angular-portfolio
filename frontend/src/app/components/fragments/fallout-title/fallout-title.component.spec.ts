import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FalloutTitleComponent } from './fallout-title.component';

describe('FalloutTitleComponent', () => {
  let component: FalloutTitleComponent;
  let fixture: ComponentFixture<FalloutTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FalloutTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FalloutTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
