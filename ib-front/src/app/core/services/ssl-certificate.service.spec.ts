import { TestBed } from '@angular/core/testing';

import { SslCertificateService } from './ssl-certificate.service';

describe('SslCertificateService', () => {
  let service: SslCertificateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SslCertificateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
