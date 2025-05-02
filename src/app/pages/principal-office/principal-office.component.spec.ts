import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrincipalOfficeComponent } from './principal-office.component';

describe('PrincipalOfficeComponent', () => {
  let component: PrincipalOfficeComponent;
  let fixture: ComponentFixture<PrincipalOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrincipalOfficeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrincipalOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
