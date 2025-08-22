import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidingTitleComponent } from './sliding-title.component';

describe('SlidingTitleComponent', () => {
  let component: SlidingTitleComponent;
  let fixture: ComponentFixture<SlidingTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlidingTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlidingTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
