import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HallAdminUploadComponent } from './hall-admin-upload.component';

describe('HallAdminUploadComponent', () => {
  let component: HallAdminUploadComponent;
  let fixture: ComponentFixture<HallAdminUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HallAdminUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HallAdminUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
