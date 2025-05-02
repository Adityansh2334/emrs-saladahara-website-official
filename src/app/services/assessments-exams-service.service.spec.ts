import { TestBed } from '@angular/core/testing';

import { AssessmentsExamsServiceService } from './assessments-exams-service.service';

describe('AssessmentsExamsServiceService', () => {
  let service: AssessmentsExamsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssessmentsExamsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
