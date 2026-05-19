import { TestBed } from '@angular/core/testing';

import { Servizio } from './servizio';

describe('Servizio', () => {
  let service: Servizio;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Servizio);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
