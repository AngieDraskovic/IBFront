import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../../../core/services/auth.service";
import {CertificateRequestService} from "../../services/certificate-request.service";
import {CustomError} from "../../../../core/models/custom-error";
import {CertificateRequest} from "../../models/certificate-request";
import {RejectionReason} from "../../../../core/models/rejection-reason";
import {NgToastService} from "ng-angular-popup";
import {LoadingService} from "../../../../core/services/loading.service";

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
              private toastService: NgToastService,
              private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.fetchIncomingCertificateRequests();
  }

  fetchIncomingCertificateRequests() {
    this.loadingService.showMain();

    this.certificateRequestService.getIncomingCertificateRequests(this.currentPage - 1, this.itemsPerPage).subscribe({
      next: (response) => {
        this.loadingService.hideMain();

        this.incomingCertificateRequests = response.content;
        this.totalItems = response.totalElements;
      },
      error: (error: CustomError) => {
        this.loadingService.hideMain();

        console.error('Error fetching certificate requests', error);
      }
    })
  }

  approveRequest(id: string) {
    this.loadingService.showMain();

    this.certificateRequestService.approveCertificateRequest(id).subscribe({
      next: () => {
        this.loadingService.hideMain();

        this.toastService.success({
          detail: "Approved successfully",
          summary: "Request approved successfully.",
          duration: 5000
        });

        this.fetchIncomingCertificateRequests();
      },
      error: (error: CustomError) => {
        this.loadingService.hideMain();

        console.error(error.message);
      }
    })
  }

  rejectRequest(id: string) {
    const rejectionReason: RejectionReason = {
      reason: "Proba"
    }

    this.loadingService.showMain();
    this.certificateRequestService.rejectCertificateRequest(id, rejectionReason).subscribe({
      next: () => {
        this.loadingService.hideMain();

        this.toastService.success({
          detail: "Rejected successfully",
          summary: "Request rejected successfully.",
          duration: 5000
        });

        this.fetchIncomingCertificateRequests();
      },
      error: (error: CustomError) => {
        this.loadingService.hideMain();

        console.error(error.message);
      }
    })
  }

  onPageChanged(newPage: number) {
    this.currentPage = newPage;
    this.fetchIncomingCertificateRequests();
  }
}
