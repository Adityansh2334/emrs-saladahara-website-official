import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SportsFitnessComponent } from './sports-fitness.component';

describe('SportsFitnessComponent', () => {
  let component: SportsFitnessComponent;
  let fixture: ComponentFixture<SportsFitnessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportsFitnessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SportsFitnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
