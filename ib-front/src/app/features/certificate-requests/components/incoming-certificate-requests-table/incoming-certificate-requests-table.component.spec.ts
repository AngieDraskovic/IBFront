import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingCertificateRequestsTableComponent } from './incoming-certificate-requests-table.component';

describe('IncomingCertificateRequestsTableComponent', () => {
  let component: IncomingCertificateRequestsTableComponent;
  let fixture: ComponentFixture<IncomingCertificateRequestsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomingCertificateRequestsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomingCertificateRequestsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
