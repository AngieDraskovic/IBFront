import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Certificate} from "../../models/certificate";
import {AuthService} from "../../../../core/services/auth.service";
import {CertificateService} from "../../services/certificate.service";
import {MatDialog} from "@angular/material/dialog";
import {NgToastService} from "ng-angular-popup";
import {CustomError} from "../../../../core/models/custom-error";
import {CertificateDownloadService} from "../../services/certificate-download.service";
import {UserRoleEnum} from "../../../../core/enums/user-role.enum";
import {NotificationService} from "../../../../core/services/notification.service";

@Component({
  selector: 'app-all-certificates-table',
  templateUrl: './all-certificates-table.component.html',
  styleUrls: ['./all-certificates-table.component.css']
})
export class AllCertificatesTableComponent implements OnInit {
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  allCertificates: Certificate[] = [];
  role: UserRoleEnum | null = UserRoleEnum.Guest;


  constructor(private authService: AuthService,
              private certificateService: CertificateService,
              private dialog: MatDialog,
              private toastService: NgToastService,
              private sharedService: CertificateDownloadService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.role = this.authService.getUserRole();
  }

  fetchAllCertificates() {
    this.certificateService.getAllPaged(this.currentPage - 1, this.itemsPerPage).subscribe({
      next: (response) => {
        this.allCertificates = response.content;
        this.totalItems = response.totalElements;
      },
      error: (error: CustomError) => {
        this.notificationService.showDefaultError('tr');
      }
    })
  }

  downloadCertificate(certificateSN: string): void {
    this.sharedService.downloadCertificate(certificateSN);
  }

  downloadPrivateKey(certificateSN: string): void {
    this.sharedService.downloadPrivateKey(certificateSN);
  }

  onPageChanged(newPage: number) {
    this.currentPage = newPage;
    this.fetchAllCertificates();
  }

  protected readonly Role = UserRoleEnum;
}
