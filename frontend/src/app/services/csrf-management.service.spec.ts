import { TestBed } from '@angular/core/testing';

import { CsrfManagementService } from './csrf-management.service';

describe('CsrfManagementService', () => {
  let service: CsrfManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsrfManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
