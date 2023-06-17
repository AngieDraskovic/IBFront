import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCertificateRequestsComponent } from './all-certificate-requests.component';

describe('AllCertificateRequestsComponent', () => {
  let component: AllCertificateRequestsComponent;
  let fixture: ComponentFixture<AllCertificateRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCertificateRequestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCertificateRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
