import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalUploadComponent } from './principal-upload.component';

describe('PrincipalUploadComponent', () => {
  let component: PrincipalUploadComponent;
  let fixture: ComponentFixture<PrincipalUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrincipalUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipalUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
