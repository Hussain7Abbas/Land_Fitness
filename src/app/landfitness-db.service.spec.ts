import { TestBed } from '@angular/core/testing';

import { LandfitnessDBService } from './landfitness-db.service';

describe('LandfitnessDBService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LandfitnessDBService = TestBed.get(LandfitnessDBService);
    expect(service).toBeTruthy();
  });
});
