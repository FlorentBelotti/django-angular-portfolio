import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimationParticuleComponent } from './animation-particule.component';

describe('AnimationParticuleComponent', () => {
  let component: AnimationParticuleComponent;
  let fixture: ComponentFixture<AnimationParticuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimationParticuleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimationParticuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
