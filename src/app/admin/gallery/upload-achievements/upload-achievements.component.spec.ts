import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAchievementsComponent } from './upload-achievements.component';

describe('UploadAchievementsComponent', () => {
  let component: UploadAchievementsComponent;
  let fixture: ComponentFixture<UploadAchievementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadAchievementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadAchievementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
