import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbsStyleComponent } from './breadcrumbs-style.component';

describe('BreadcrumbsStyleComponent', () => {
  let component: BreadcrumbsStyleComponent;
  let fixture: ComponentFixture<BreadcrumbsStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbsStyleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
