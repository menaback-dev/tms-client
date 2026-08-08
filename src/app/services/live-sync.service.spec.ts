import { TestBed } from '@angular/core/testing';

import { LiveSyncService } from './live-sync.service';

describe('LiveSyncService', () => {
  let service: LiveSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiveSyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
