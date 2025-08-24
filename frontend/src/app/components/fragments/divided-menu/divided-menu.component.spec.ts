import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DividedMenuComponent } from './divided-menu.component';

describe('DividedMenuComponent', () => {
  let component: DividedMenuComponent;
  let fixture: ComponentFixture<DividedMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DividedMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DividedMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
