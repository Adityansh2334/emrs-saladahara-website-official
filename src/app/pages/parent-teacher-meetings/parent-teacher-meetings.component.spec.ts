import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentTeacherMeetingsComponent } from './parent-teacher-meetings.component';

describe('ParentTeacherMeetingsComponent', () => {
  let component: ParentTeacherMeetingsComponent;
  let fixture: ComponentFixture<ParentTeacherMeetingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentTeacherMeetingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentTeacherMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
