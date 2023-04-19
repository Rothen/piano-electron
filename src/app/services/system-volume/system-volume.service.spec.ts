import { TestBed } from '@angular/core/testing';

import { SystemVolumeService } from './system-volume.service';

describe('SystemVolumeService', () => {
  let service: SystemVolumeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemVolumeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
