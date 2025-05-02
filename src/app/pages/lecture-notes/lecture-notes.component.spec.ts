import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureNotesComponent } from './lecture-notes.component';

describe('LectureNotesComponent', () => {
  let component: LectureNotesComponent;
  let fixture: ComponentFixture<LectureNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LectureNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LectureNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
