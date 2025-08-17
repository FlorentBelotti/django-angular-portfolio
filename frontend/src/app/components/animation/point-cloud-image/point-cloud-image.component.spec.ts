import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointCloudImageComponent } from './point-cloud-image.component';

describe('PointCloudImageComponent', () => {
  let component: PointCloudImageComponent;
  let fixture: ComponentFixture<PointCloudImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointCloudImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointCloudImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
