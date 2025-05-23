import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HallAdminViewerComponent } from './hall-admin-viewer.component';

describe('HallAdminViewerComponent', () => {
  let component: HallAdminViewerComponent;
  let fixture: ComponentFixture<HallAdminViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HallAdminViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HallAdminViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
