import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCertificateRequestsTableComponent } from './all-certificate-requests-table.component';

describe('AllCertificateRequestsTableComponent', () => {
  let component: AllCertificateRequestsTableComponent;
  let fixture: ComponentFixture<AllCertificateRequestsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCertificateRequestsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCertificateRequestsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
