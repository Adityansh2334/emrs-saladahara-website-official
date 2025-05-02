import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyResourcesComponent } from './study-resources.component';

describe('StudyResourcesComponent', () => {
  let component: StudyResourcesComponent;
  let fixture: ComponentFixture<StudyResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyResourcesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
