import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCertificateRequestDialogComponent } from './create-certificate-request-dialog.component';

describe('CreateRequestDialogComponent', () => {
  let component: CreateCertificateRequestDialogComponent;
  let fixture: ComponentFixture<CreateCertificateRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCertificateRequestDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCertificateRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
