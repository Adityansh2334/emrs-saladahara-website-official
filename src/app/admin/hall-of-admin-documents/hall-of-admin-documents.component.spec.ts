import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HallOfAdminDocumentsComponent } from './hall-of-admin-documents.component';

describe('HallOfAdminDocumentsComponent', () => {
  let component: HallOfAdminDocumentsComponent;
  let fixture: ComponentFixture<HallOfAdminDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HallOfAdminDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HallOfAdminDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
