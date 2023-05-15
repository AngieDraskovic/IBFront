import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../../../core/services/auth.service";
import {CertificateRequestService} from "../../services/certificate-request.service";
import {CustomError} from "../../../../core/models/custom-error";
import {CertificateRequest} from "../../models/certificate-request";
import {RejectionReason} from "../../../../core/models/rejection-reason";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-incoming-certificate-requests-table',
  templateUrl: './incoming-certificate-requests-table.component.html',
  styleUrls: ['./incoming-certificate-requests-table.component.css']
})
export class IncomingCertificateRequestsTableComponent implements OnInit{
  @Output() refreshEvent: EventEmitter<any> = new EventEmitter();

  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  incomingCertificateRequests: CertificateRequest[] = [];

  constructor(private authService: AuthService,
              private certificateRequestService: CertificateRequestService,
              private toastService: NgToastService) {
  }

  ngOnInit(): void {
    this.fetchIncomingCertificateRequests();
  }

  fetchIncomingCertificateRequests() {
    this.certificateRequestService.getIncomingCertificateRequests(this.currentPage - 1, this.itemsPerPage).subscribe({
      next: (response) => {
        this.incomingCertificateRequests = response.content;
        this.totalItems = response.totalElements;
      },
      error: (error: CustomError) => {
        console.error('Error fetching certificate requests', error);
      }
    })
  }

  approveRequest(id: string) {
    this.certificateRequestService.approveCertificateRequest(id).subscribe({
      next: () => {
        this.toastService.success({
          detail: "Approved successfully",
          summary: "Request approved successfully.",
          duration: 5000
        });

        this.fetchIncomingCertificateRequests();
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

        this.fetchIncomingCertificateRequests();
      },
      error: (error: CustomError) => {
        console.error(error.message);
      }
    })
  }

  onPageChanged(newPage: number) {
    this.currentPage = newPage;
    this.fetchIncomingCertificateRequests();
  }
}
