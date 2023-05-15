import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingCertificateRequestsTableComponent } from './outgoing-certificate-requests-table.component';

describe('OutgoingRequestsTableComponent', () => {
  let component: OutgoingCertificateRequestsTableComponent;
  let fixture: ComponentFixture<OutgoingCertificateRequestsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutgoingCertificateRequestsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingCertificateRequestsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
