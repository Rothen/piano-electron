import { TestBed } from '@angular/core/testing';

import { MidiKeyboardService } from './midi-keyboard.service';

describe('MidiKeyboardService', () => {
  let service: MidiKeyboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MidiKeyboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
