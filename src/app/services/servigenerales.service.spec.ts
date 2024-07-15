import { TestBed } from '@angular/core/testing';

import { ServigeneralesService } from './servigenerales.service';

describe('ServigeneralesService', () => {
  let service: ServigeneralesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServigeneralesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
