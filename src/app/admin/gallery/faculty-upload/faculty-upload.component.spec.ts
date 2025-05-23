import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyUploadComponent } from './faculty-upload.component';

describe('FacultyUploadComponent', () => {
  let component: FacultyUploadComponent;
  let fixture: ComponentFixture<FacultyUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacultyUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacultyUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
