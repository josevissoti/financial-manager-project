import { TestBed } from '@angular/core/testing';

import { Lancamento } from './lancamento';

describe('Lancamento', () => {
  let service: Lancamento;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Lancamento);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
