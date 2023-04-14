import { TestBed } from '@angular/core/testing';

import { NotePlayerService } from './note-player.service';

describe('NotePlayerService', () => {
  let service: NotePlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotePlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
