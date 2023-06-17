import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateValidationDialogComponent } from './certificate-validation-dialog.component';

describe('CertificateValidationDialogComponent', () => {
  let component: CertificateValidationDialogComponent;
  let fixture: ComponentFixture<CertificateValidationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificateValidationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateValidationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
