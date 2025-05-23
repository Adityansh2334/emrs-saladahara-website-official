import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadGalleryComponent } from './upload-gallery.component';

describe('UploadGalleryComponent', () => {
  let component: UploadGalleryComponent;
  let fixture: ComponentFixture<UploadGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
