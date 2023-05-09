import {Component, OnInit} from '@angular/core';
import {CertificateRequest} from "../../interfaces/certificate-request";
import {MatDialog} from "@angular/material/dialog";
import {CreateRequestDialogComponent} from "../create-request-dialog/create-request-dialog.component";
import {NgToastService} from "ng-angular-popup";
import {CertificateRequestService} from "../../../core/services/certificate-request.service";
import {CustomError} from "../../interfaces/custom-error";
import {OutgoingCertificateRequest} from "../../interfaces/outgoing-certificate-request";
import {CertificateRequestStatus} from "../../enums/certificate-request-status.enum";
import {RejectionReason} from "../../interfaces/rejection-reason";

@Component({
  selector: 'app-certificate-requests',
  templateUrl: './certificate-requests.component.html',
  styleUrls: ['./certificate-requests.component.css']
})
export class CertificateRequestsComponent implements OnInit {
  outgoingRequests?: OutgoingCertificateRequest[];
  incomingRequests?: CertificateRequest[];

  numberOfRequests: number = 0;
  numberOfAcceptedRequests: number = 0;
  numberOfRejectedRequests: number = 0;


  constructor(private certificateRequestService: CertificateRequestService,
              private dialog: MatDialog,
              private toastService: NgToastService) {
  }

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests() {
    this.fetchOutgoingRequests();
    this.fetchIncomingRequests();
  }

  fetchOutgoingRequests() {
    this.certificateRequestService.getOutgoingCertificateRequests().subscribe({
      next: (certificateRequests) => {
        this.outgoingRequests = certificateRequests;

        this.numberOfRequests = this.outgoingRequests.length;
        this.numberOfAcceptedRequests = this.getNumberOfAcceptedRequests();
        this.numberOfRejectedRequests = this.getNumberOfRevokedCertificates();
      },
      error: (error: CustomError) => {
        console.error(error.message);
      }
    })
  }

  fetchIncomingRequests() {
    this.certificateRequestService.getIncomingCertificateRequests().subscribe({
      next: (certificateRequests) => {
        this.incomingRequests = certificateRequests;
      },
      error: (error: CustomError) => {
        console.error(error.message);
      }
    })
  }

  openCreateRequestDialog() {
    const dialogRef = this.dialog.open(CreateRequestDialogComponent, {});
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.toastService.success({
          detail: "Request created",
          summary: "Request created successfully.",
          duration: 5000
        });
      }
    });
  }

  private getNumberOfAcceptedRequests() {
    if (!this.outgoingRequests) {
      return 0;
    }

    return this.outgoingRequests.filter(request => request.status === CertificateRequestStatus.APPROVED).length;
  }

  private getNumberOfRevokedCertificates() {
    if (!this.outgoingRequests) {
      return 0;
    }

    return this.outgoingRequests.filter(request => request.status === CertificateRequestStatus.REJECTED).length;
  }

  approveRequest(id: string) {
    this.certificateRequestService.approveCertificateRequest(id).subscribe({
      next: () => {
        this.toastService.success({
          detail: "Approved successfully",
          summary: "Request approved successfully.",
          duration: 5000
        });

        this.fetchIncomingRequests();
      },
      error: (error: CustomError) => {
        console.error(error.message);
      }
    })
  }

  rejectRequest(id: string) {
    const rejectionReason: RejectionReason = {
      reason: "Proba"
    }

    this.certificateRequestService.rejectCertificateRequest(id, rejectionReason).subscribe({
      next: () => {
        this.toastService.success({
          detail: "Rejected successfully",
          summary: "Request rejected successfully.",
          duration: 5000
        });

        this.fetchIncomingRequests();
      },
      error: (error: CustomError) => {
        console.error(error.message);
      }
    })
  }
}
