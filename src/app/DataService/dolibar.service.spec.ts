import { TestBed } from '@angular/core/testing';

import { DolibarService } from './dolibar.service';

describe('DolibarService', () => {
  let service: DolibarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DolibarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
