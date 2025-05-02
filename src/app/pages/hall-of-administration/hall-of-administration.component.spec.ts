import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HallOfAdministrationComponent } from './hall-of-administration.component';

describe('HallOfAdministrationComponent', () => {
  let component: HallOfAdministrationComponent;
  let fixture: ComponentFixture<HallOfAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HallOfAdministrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HallOfAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
