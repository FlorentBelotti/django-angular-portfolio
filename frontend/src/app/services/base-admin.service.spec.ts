import { TestBed } from '@angular/core/testing';

import { BaseAdminService } from './base-admin.service';

describe('BaseAdminService', () => {
  let service: BaseAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
