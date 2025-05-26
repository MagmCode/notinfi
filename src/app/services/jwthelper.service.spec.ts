import { TestBed } from '@angular/core/testing';

import { JWThelperService } from './jwthelper.service';

describe('JWThelperService', () => {
  let service: JWThelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JWThelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
