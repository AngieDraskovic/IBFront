import {Component, OnInit} from '@angular/core';
import {SslCertificate} from "../../interfaces/ssl-certificate";
import {SslCertificateService} from "../../../core/services/ssl-certificate.service";
import {CustomError} from "../../interfaces/custom-error";
import {CertificateStatus} from "../../enums/certificate-status.enum";
import {MatDialog} from "@angular/material/dialog";
import {
  CertificateValidationDialogComponent
} from "../certificate-validation-dialog/certificate-validation-dialog.component";
import {AuthService} from "../../../core/services/auth.service";
import {NgToastService} from "ng-angular-popup";
import {RevokeCertificateDialogComponent} from "../revoke-certificate-dialog/revoke-certificate-dialog.component";

@Component({
  selector: 'app-ssl-certificates',
  templateUrl: './ssl-certificates.component.html',
  styleUrls: ['./ssl-certificates.component.css']
})
export class SslCertificatesComponent implements OnInit {
  protected readonly CertificateStatus = CertificateStatus;

  certificatesOwned?: SslCertificate[];
  certificatesIssued?: SslCertificate[];

  numberOfCertificates: number = 0;
  numberOfPendingCertificates: number = 0;
  numberOfRevokedCertificates: number = 0;

  constructor(private authService: AuthService, private certificateService: SslCertificateService,
              private dialog: MatDialog, private toastService: NgToastService) {
  }

  ngOnInit(): void {
    this.fetchCertificates();
  }

  fetchCertificates() {
    this.fetchOwnedCertificates();
    this.fetchIssuedCertificates();
  }

  fetchOwnedCertificates() {
    this.certificateService.getCertificatesForUser().subscribe({
      next: (certificates) => {
        this.certificatesOwned = certificates;
      },
      error: (error: CustomError) => {
        console.error('Error fetching certificates', error);
      }
    })
  }

  fetchIssuedCertificates() {
    this.certificateService.getCertificatesIssuedByUser().subscribe({
      next: (certificates) => {
        this.certificatesIssued = certificates;
        this.numberOfCertificates = this.certificatesIssued.length;
        this.numberOfPendingCertificates = this.getNumberOfPendingCertificates();
        this.numberOfRevokedCertificates = this.getNumberOfRevokedCertificates();
      },
      error: (error: CustomError) => {
        console.error('Error fetching certificates', error);
      }
    })
  }

  getNumberOfPendingCertificates(): number {
    if (!this.certificatesIssued) {
      return 0;
    }

    return this.certificatesIssued.filter(certificate => certificate.status === CertificateStatus.PENDING).length;
  }

  getNumberOfRevokedCertificates(): number {
    if (!this.certificatesIssued) {
      return 0;
    }

    return this.certificatesIssued.filter(certificate => certificate.status === CertificateStatus.REVOKED).length;
  }

  openCertificateValidationDialog(): void {
    const dialogRef = this.dialog.open(CertificateValidationDialogComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  downloadCertificate(certificateSN: string): void {
    this.certificateService.downloadCertificate(certificateSN).subscribe({
        next: (data) => {
          const blob = new Blob([data], {type: 'application/x-pem-file'});
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.download = `certificate_${certificateSN}.pem`;
          link.click();

          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Error downloading certificate', error);
        }
      }
    );
  }

  revokeCertificate(serialNumber: string) {
    const dialogRef = this.dialog.open(RevokeCertificateDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.certificateService.revokeCertificate(serialNumber).subscribe({
          next: (data) => {
            this.fetchCertificates();
            this.toastService.success({
              detail: "Certificate revoked",
              summary: "Certificate revoked successfully.",
              duration: 5000
            });
          },
          error: (error) => {
            this.toastService.error({
              detail: "Error",
              summary: "An error occurred.",
              duration: 5000
            });
          }
        });
      }
    });
  }
}
