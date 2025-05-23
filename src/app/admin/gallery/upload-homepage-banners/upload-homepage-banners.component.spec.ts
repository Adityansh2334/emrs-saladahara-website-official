import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadHomepageBannersComponent } from './upload-homepage-banners.component';

describe('UploadHomepageBannersComponent', () => {
  let component: UploadHomepageBannersComponent;
  let fixture: ComponentFixture<UploadHomepageBannersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadHomepageBannersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadHomepageBannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
