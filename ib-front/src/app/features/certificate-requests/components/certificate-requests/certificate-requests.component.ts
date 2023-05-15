import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {
  CreateCertificateRequestDialogComponent
} from "../create-certificate-request-dialog/create-certificate-request-dialog.component";
import {NgToastService} from "ng-angular-popup";
import {CertificateRequestService} from "../../services/certificate-request.service";
import {
  OutgoingCertificateRequestsTableComponent
} from "../outgoing-certificate-requests-table/outgoing-certificate-requests-table.component";
import {
  IncomingCertificateRequestsTableComponent
} from "../incoming-certificate-requests-table/incoming-certificate-requests-table.component";
import {forkJoin} from "rxjs";
import {CertificateStatus} from "../../../certificates/enums/certificate-status.enum";
import {CertificateRequestStatus} from "../../enums/certificate-request-status.enum";

@Component({
  selector: 'app-certificate-requests',
  templateUrl: './certificate-requests.component.html',
  styleUrls: ['./certificate-requests.component.css']
})
export class CertificateRequestsComponent implements OnInit {
  @ViewChild('outgoingCertificateRequests', {static: false}) outgoingCertificateRequests?: OutgoingCertificateRequestsTableComponent;
  @ViewChild('incomingCertificateRequests', {static: false}) incomingCertificateRequests?: IncomingCertificateRequestsTableComponent;
  @Output() myEvent: EventEmitter<any> = new EventEmitter();

  numberOfRequests: number = 0;
  numberOfApprovedRequests: number = 0;
  numberOfRejectedRequests: number = 0;


  constructor(private certificateRequestService: CertificateRequestService,
              private dialog: MatDialog,
              private toastService: NgToastService) {
  }

  ngOnInit(): void {
    this.fetchStatistics();
  }

  refresh() {
    this.fetchStatistics();
    this.outgoingCertificateRequests?.fetchOutgoingCertificateRequests();
    this.incomingCertificateRequests?.fetchIncomingCertificateRequests();
  }

  fetchStatistics() {
    forkJoin({
      all: this.certificateRequestService.countAllCertificateRequestsByUser(),
      approved: this.certificateRequestService.countCertificateRequestsByStatusAndUser(CertificateRequestStatus.APPROVED),
      rejected: this.certificateRequestService.countCertificateRequestsByStatusAndUser(CertificateRequestStatus.REJECTED),
    }).subscribe(({ all, approved, rejected }) => {
      this.numberOfRequests = all;
      this.numberOfApprovedRequests = approved;
      this.numberOfRejectedRequests  = rejected;
    });
  }

  openCreateRequestDialog() {
    const dialogRef = this.dialog.open(CreateCertificateRequestDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refresh();
        this.toastService.success({
          detail: "Request created",
          summary: "Request created successfully.",
          duration: 5000
        });
      }
    });
  }
}
