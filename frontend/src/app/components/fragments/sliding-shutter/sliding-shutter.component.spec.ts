import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidingShutterComponent } from './sliding-shutter.component';

describe('SlidingShutterComponent', () => {
  let component: SlidingShutterComponent;
  let fixture: ComponentFixture<SlidingShutterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlidingShutterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlidingShutterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
