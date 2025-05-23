import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticeDocumentsComponent } from './notice-documents.component';

describe('NoticeDocumentsComponent', () => {
  let component: NoticeDocumentsComponent;
  let fixture: ComponentFixture<NoticeDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticeDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticeDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
