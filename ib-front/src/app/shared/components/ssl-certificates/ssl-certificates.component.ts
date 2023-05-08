import {Component, OnInit} from '@angular/core';
import {SslCertificate} from "../../interfaces/ssl-certificate";
import {SslCertificateService} from "../../services/ssl-certificate.service";
import {CustomError} from "../../interfaces/custom-error";
import {CertificateStatus} from "../../enums/certificate-status.enum";
import {MatDialog} from "@angular/material/dialog";
import {
  CertificateValidationDialogComponent
} from "../certificate-validation-dialog/certificate-validation-dialog.component";

@Component({
  selector: 'app-ssl-certificates',
  templateUrl: './ssl-certificates.component.html',
  styleUrls: ['./ssl-certificates.component.css']
})
export class SslCertificatesComponent implements OnInit {
  certificates?: SslCertificate[];
  numberOfCertificates: number = 0;
  numberOfPendingCertificates: number = 0;
  numberOfRevokedCertificates: number = 0;

  constructor(private sslCertificateService: SslCertificateService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.fetchCertificates();
  }

  fetchCertificates() {
    this.sslCertificateService.getCertificates().subscribe({
      next: (certificates) => {
        this.certificates = certificates;
        this.numberOfCertificates = this.certificates.length;
        this.numberOfPendingCertificates = this.getNumberOfPendingCertificates();
        this.numberOfRevokedCertificates = this.getNumberOfRevokedCertificates();
      },
      error: (error: CustomError) => {
        console.error('Error fetching certificates', error);
      }
    })
  }

  getNumberOfPendingCertificates(): number {
    if (!this.certificates) {
      return 0;
    }

    return this.certificates.filter(certificate => certificate.status === CertificateStatus.PENDING).length;
  }

  getNumberOfRevokedCertificates(): number {
    if (!this.certificates) {
      return 0;
    }

    return this.certificates.filter(certificate => certificate.status === CertificateStatus.REVOKED).length;
  }

  openCertificateValidationDialog(): void {
    const dialogRef = this.dialog.open(CertificateValidationDialogComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  downloadCertificate(certificateSN: string): void {
    this.sslCertificateService.downloadCertificate(certificateSN).subscribe({
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

  pageChanged($event: any) {

  }
}
