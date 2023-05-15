import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../core/services/auth.service";
import {CertificateRequestService} from "../../services/certificate-request.service";
import {CustomError} from "../../../../core/models/custom-error";
import {CertificateRequest} from "../../models/certificate-request";
import {forkJoin} from "rxjs";
import {CertificateRequestStatus} from "../../enums/certificate-request-status.enum";

@Component({
  selector: 'app-all-certificate-requests',
  templateUrl: './all-certificate-requests.component.html',
  styleUrls: ['./all-certificate-requests.component.css']
})
export class AllCertificateRequestsComponent implements OnInit {
  numberOfRequests: number = 0;
  numberOfApprovedRequests: number = 0;
  numberOfRejectedRequests: number = 0;

  constructor(private authService: AuthService,
              private certificateRequestService: CertificateRequestService) {
  }

  ngOnInit(): void {
    this.fetchStatistics();
  }

  fetchStatistics() {
    forkJoin({
      all: this.certificateRequestService.countAllCertificateRequests(),
      approved: this.certificateRequestService.countCertificateRequestsByStatus(CertificateRequestStatus.APPROVED),
      rejected: this.certificateRequestService.countCertificateRequestsByStatus(CertificateRequestStatus.REJECTED),
    }).subscribe(({ all, approved, rejected }) => {
      this.numberOfRequests = all;
      this.numberOfApprovedRequests = approved;
      this.numberOfRejectedRequests  = rejected;
    });
  }
}
