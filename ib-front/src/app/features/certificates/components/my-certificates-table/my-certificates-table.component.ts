import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Certificate} from "../../models/certificate";
import {AuthService} from "../../../../core/services/auth.service";
import {CertificateService} from "../../services/certificate.service";
import {MatDialog} from "@angular/material/dialog";
import {NgToastService} from "ng-angular-popup";
import {CustomError} from "../../../../core/models/custom-error";
import {RevokeCertificateDialogComponent} from "../revoke-certificate-dialog/revoke-certificate-dialog.component";
import {CertificateDownloadService} from "../../services/certificate-download.service";
import {CertificateStatus} from "../../enums/certificate-status.enum";
import {UserRoleEnum} from "../../../../core/enums/user-role.enum";

@Component({
  selector: 'app-my-certificates-table',
  templateUrl: './my-certificates-table.component.html',
  styleUrls: ['./my-certificates-table.component.css']
})
export class MyCertificatesTableComponent implements OnInit {
  protected readonly CertificateStatus = CertificateStatus;
  @Output() refreshEvent: EventEmitter<any> = new EventEmitter();

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  certificatesOwned: Certificate[] = [];

  constructor(private authService: AuthService,
              private certificateService: CertificateService,
              private dialog: MatDialog,
              private toastService: NgToastService,
              private sharedService: CertificateDownloadService) {
  }

  ngOnInit(): void {
    this.fetchOwnedCertificates();
  }

  fetchOwnedCertificates() {
    this.certificateService.getCertificatesForUser(this.currentPage - 1, this.itemsPerPage).subscribe({
      next: (response) => {
        this.certificatesOwned = response.content;
        this.totalItems = response.totalElements;
      },
      error: (error: CustomError) => {
        console.error('Error fetching certificates', error);
      }
    })
  }

  downloadCertificate(certificateSN: string): void {
    this.sharedService.downloadCertificate(certificateSN);
  }

  downloadPrivateKey(certificateSN: string): void {
    this.sharedService.downloadPrivateKey(certificateSN);
  }

  revokeCertificate(serialNumber: string) {
    const dialogRef = this.dialog.open(RevokeCertificateDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.certificateService.revokeCertificate(serialNumber).subscribe({
          next: (data) => {
            this.fetchOwnedCertificates();
            this.toastService.success({
              detail: "Certificate revoked",
              summary: "Certificate revoked successfully.",
              duration: 5000
            });

            this.refreshEvent.emit();
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

  onPageChanged(newPage: number) {
    this.currentPage = newPage;
    this.fetchOwnedCertificates();
  }
}
