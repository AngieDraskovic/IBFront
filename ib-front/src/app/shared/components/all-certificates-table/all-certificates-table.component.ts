import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Certificate} from "../../interfaces/certificate";
import {AuthService} from "../../../core/services/auth.service";
import {CertificateService} from "../../../core/services/certificate.service";
import {MatDialog} from "@angular/material/dialog";
import {NgToastService} from "ng-angular-popup";
import {CustomError} from "../../interfaces/custom-error";
import {CertificateStatus} from "../../enums/certificate-status.enum";
import {SharedService} from "../../../core/services/shared.service";
import {th} from "date-fns/locale";
import {forkJoin} from "rxjs";
import {Role} from "../../../core/enums/role";

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
  role: Role = Role.Guest;


  constructor(private authService: AuthService,
              private certificateService: CertificateService,
              private dialog: MatDialog,
              private toastService: NgToastService,
              private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.role = this.authService.currentUserValue?.role ?? Role.Guest;
    this.refresh()
  }

  refresh() {
    this.fetchAllCertificates();
  }

  fetchAllCertificates() {
    this.certificateService.getAllPaged(this.currentPage - 1, this.itemsPerPage).subscribe({
      next: (response) => {
        this.allCertificates = response.content;
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

  onPageChanged(newPage: number) {
    this.currentPage = newPage;
    this.fetchAllCertificates();
  }

  protected readonly Role = Role;
}
