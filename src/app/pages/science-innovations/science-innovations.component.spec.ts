import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScienceInnovationsComponent } from './science-innovations.component';

describe('ScienceInnovationsComponent', () => {
  let component: ScienceInnovationsComponent;
  let fixture: ComponentFixture<ScienceInnovationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScienceInnovationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScienceInnovationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
