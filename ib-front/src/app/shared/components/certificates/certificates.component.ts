import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {CertificateService} from "../../../core/services/certificate.service";
import {MatDialog} from "@angular/material/dialog";
import {
  CertificateValidationDialogComponent
} from "../certificate-validation-dialog/certificate-validation-dialog.component";
import {AuthService} from "../../../core/services/auth.service";
import {forkJoin} from "rxjs";
import {CertificateStatus} from "../../enums/certificate-status.enum";
import {AllCertificatesTableComponent} from "../all-certificates-table/all-certificates-table.component";
import {MyCertificatesTableComponent} from "../my-certificates-table/my-certificates-table.component";

@Component({
  selector: 'app-ssl-certificates',
  templateUrl: './certificates.component.html',
  styleUrls: ['./certificates.component.css']
})
export class CertificatesComponent implements OnInit {
  @ViewChild('allCertificates', { static: false }) allCertificates?: AllCertificatesTableComponent;
  @ViewChild('myCertificates', { static: false }) myCertificates?: MyCertificatesTableComponent;
  @Output() myEvent: EventEmitter<any> = new EventEmitter();

  numberOfCertificates: number = 0;
  numberOfExpiredCertificates: number = 0;
  numberOfRevokedCertificates: number = 0;

  constructor(private authService: AuthService,
              private certificateService: CertificateService,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.fetchStatistics();
  }

  refresh() {
    this.fetchStatistics();
    this.allCertificates?.fetchAllCertificates();
    this.myCertificates?.fetchOwnedCertificates();
  }

  fetchStatistics() {
    forkJoin({
      all: this.certificateService.countAllCertificates(),
      pending: this.certificateService.countCertificatesByStatus(CertificateStatus.EXPIRED),
      revoked: this.certificateService.countCertificatesByStatus(CertificateStatus.REVOKED),
    }).subscribe(({ all, pending, revoked }) => {
      this.numberOfCertificates = all;
      this.numberOfExpiredCertificates = pending;
      this.numberOfRevokedCertificates  = revoked;
    });
  }

  openCertificateValidationDialog(): void {
    this.dialog.open(CertificateValidationDialogComponent, {});
  }
}
