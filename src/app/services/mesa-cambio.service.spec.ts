import { TestBed } from '@angular/core/testing';

import { MesaCambioService } from './mesa-cambio.service';

describe('MesaCambioService', () => {
  let service: MesaCambioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MesaCambioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
