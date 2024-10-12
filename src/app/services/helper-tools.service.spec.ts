import { TestBed } from '@angular/core/testing';

import { HelperToolsService } from './helper-tools.service';

describe('HelperToolsService', () => {
  let service: HelperToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelperToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
