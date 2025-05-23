import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureDocumentsComponent } from './lecture-documents.component';

describe('LectureDocumentsComponent', () => {
  let component: LectureDocumentsComponent;
  let fixture: ComponentFixture<LectureDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectureDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LectureDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
