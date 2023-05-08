import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SslCertificatesComponent } from './ssl-certificates.component';

describe('SslCertificatesComponent', () => {
  let component: SslCertificatesComponent;
  let fixture: ComponentFixture<SslCertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SslCertificatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SslCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
