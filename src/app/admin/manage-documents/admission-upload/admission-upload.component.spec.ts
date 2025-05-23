import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmissionUploadComponent } from './admission-upload.component';

describe('AdmissionUploadComponent', () => {
  let component: AdmissionUploadComponent;
  let fixture: ComponentFixture<AdmissionUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdmissionUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdmissionUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
