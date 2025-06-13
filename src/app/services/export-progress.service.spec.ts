import { TestBed } from '@angular/core/testing';

import { ExportProgressService } from './export-progress.service';

describe('ExportProgressService', () => {
  let service: ExportProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
