import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentsUploadComponent } from './assignments-upload.component';

describe('AssignmentsUploadComponent', () => {
  let component: AssignmentsUploadComponent;
  let fixture: ComponentFixture<AssignmentsUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentsUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
