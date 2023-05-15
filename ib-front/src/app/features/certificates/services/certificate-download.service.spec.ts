import { TestBed } from '@angular/core/testing';

import { CertificateDownloadService } from './certificate-download.service';

describe('SharedService', () => {
  let service: CertificateDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificateDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
