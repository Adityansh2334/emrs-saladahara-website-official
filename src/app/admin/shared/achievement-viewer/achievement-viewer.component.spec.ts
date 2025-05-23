import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementViewerComponent } from './achievement-viewer.component';

describe('AchievementViewerComponent', () => {
  let component: AchievementViewerComponent;
  let fixture: ComponentFixture<AchievementViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
