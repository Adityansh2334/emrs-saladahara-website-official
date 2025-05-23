import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralGalleryImageUploaderComponent } from './general-gallery-image-uploader.component';

describe('GeneralGalleryImageUploaderComponent', () => {
  let component: GeneralGalleryImageUploaderComponent;
  let fixture: ComponentFixture<GeneralGalleryImageUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralGalleryImageUploaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralGalleryImageUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
