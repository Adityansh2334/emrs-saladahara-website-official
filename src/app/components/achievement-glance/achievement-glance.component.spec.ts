import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementGlanceComponent } from './achievement-glance.component';

describe('AchievementGlanceComponent', () => {
  let component: AchievementGlanceComponent;
  let fixture: ComponentFixture<AchievementGlanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AchievementGlanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementGlanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
