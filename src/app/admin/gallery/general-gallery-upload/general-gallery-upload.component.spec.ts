import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralGalleryUploadComponent } from './general-gallery-upload.component';

describe('GeneralGalleryUploadComponent', () => {
  let component: GeneralGalleryUploadComponent;
  let fixture: ComponentFixture<GeneralGalleryUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralGalleryUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralGalleryUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
