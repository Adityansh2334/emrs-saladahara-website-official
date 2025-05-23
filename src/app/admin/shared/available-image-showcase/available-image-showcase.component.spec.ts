import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableImageShowcaseComponent } from './available-image-showcase.component';

describe('AvailableImageShowcaseComponent', () => {
  let component: AvailableImageShowcaseComponent;
  let fixture: ComponentFixture<AvailableImageShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableImageShowcaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableImageShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
