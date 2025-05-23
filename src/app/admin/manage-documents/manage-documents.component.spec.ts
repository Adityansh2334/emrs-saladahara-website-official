import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDocumentsComponent } from './manage-documents.component';

describe('ManageDocumentsComponent', () => {
  let component: ManageDocumentsComponent;
  let fixture: ComponentFixture<ManageDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
