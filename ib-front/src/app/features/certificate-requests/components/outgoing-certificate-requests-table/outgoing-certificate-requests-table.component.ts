import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../core/services/auth.service";
import {CustomError} from "../../../../core/models/custom-error";
import {CertificateRequestService} from "../../services/certificate-request.service";
import {OutgoingCertificateRequest} from "../../models/outgoing-certificate-request";
import {LoadingService} from "../../../../core/services/loading.service";

@Component({
  selector: 'app-outgoing-requests-table',
  templateUrl: './outgoing-certificate-requests-table.component.html',
  styleUrls: ['./outgoing-certificate-requests-table.component.css']
})
export class OutgoingCertificateRequestsTableComponent implements OnInit {
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  outgoingCertificateRequests: OutgoingCertificateRequest[] = [];

  constructor(private authService: AuthService,
              private certificateRequestService: CertificateRequestService,
              private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.fetchOutgoingCertificateRequests();
  }

  fetchOutgoingCertificateRequests() {
    this.loadingService.showMain();

    this.certificateRequestService.getOutgoingCertificateRequests(this.currentPage - 1, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.loadingService.hideMain();

          this.outgoingCertificateRequests = response.content;
          this.totalItems = response.totalElements;
        },
        error: (error: CustomError) => {
          this.loadingService.hideMain();

          console.log(error);
        }
      })
  }

  onPageChanged(newPage: number) {
    this.currentPage = newPage;
    this.fetchOutgoingCertificateRequests();
  }
}
