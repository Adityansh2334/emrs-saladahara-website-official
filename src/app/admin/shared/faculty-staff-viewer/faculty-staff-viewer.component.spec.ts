import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyStaffViewerComponent } from './faculty-staff-viewer.component';

describe('FacultyStaffViewerComponent', () => {
  let component: FacultyStaffViewerComponent;
  let fixture: ComponentFixture<FacultyStaffViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacultyStaffViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacultyStaffViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
