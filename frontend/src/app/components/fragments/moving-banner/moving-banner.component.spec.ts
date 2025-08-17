import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovingBannerComponent } from './moving-banner.component';

describe('MovingBannerComponent', () => {
  let component: MovingBannerComponent;
  let fixture: ComponentFixture<MovingBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovingBannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovingBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
