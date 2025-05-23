import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralGalleryViewerComponent } from './general-gallery-viewer.component';

describe('GeneralGalleryViewerComponent', () => {
  let component: GeneralGalleryViewerComponent;
  let fixture: ComponentFixture<GeneralGalleryViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralGalleryViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralGalleryViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
