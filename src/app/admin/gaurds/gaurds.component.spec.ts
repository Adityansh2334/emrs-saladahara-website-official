import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaurdsComponent } from './gaurds.component';

describe('GaurdsComponent', () => {
  let component: GaurdsComponent;
  let fixture: ComponentFixture<GaurdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaurdsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GaurdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
