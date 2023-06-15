import { TestBed } from '@angular/core/testing';

import { RemoveATagsService } from './remove-atags.service';

describe('RemoveATagsService', () => {
  let service: RemoveATagsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemoveATagsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
