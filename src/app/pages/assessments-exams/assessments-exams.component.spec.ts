import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentsExamsComponent } from './assessments-exams.component';

describe('AssessmentsExamsComponent', () => {
  let component: AssessmentsExamsComponent;
  let fixture: ComponentFixture<AssessmentsExamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssessmentsExamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssessmentsExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
