import { TestBed } from '@angular/core/testing';

import { FeuilleDeTempsService } from './feuille-de-temps.service';

describe('FeuilleDeTempsService', () => {
  let service: FeuilleDeTempsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeuilleDeTempsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
