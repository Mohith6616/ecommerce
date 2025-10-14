import { TestBed } from '@angular/core/testing';

import { ProductsrvcService } from './productsrvc.service';

describe('ProductsrvcService', () => {
  let service: ProductsrvcService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsrvcService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
