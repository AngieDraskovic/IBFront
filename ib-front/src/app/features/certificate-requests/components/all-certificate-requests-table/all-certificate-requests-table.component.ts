import {Component, OnInit} from '@angular/core';
import {CertificateRequest} from "../../models/certificate-request";
import {AuthService} from "../../../../core/services/auth.service";
import {CertificateRequestService} from "../../services/certificate-request.service";
import {CustomError} from "../../../../core/models/custom-error";
import {LoadingService} from "../../../../core/services/loading.service";

@Component({
  selector: 'app-all-certificate-requests-table',
  templateUrl: './all-certificate-requests-table.component.html',
  styleUrls: ['./all-certificate-requests-table.component.css']
})
export class AllCertificateRequestsTableComponent implements OnInit{
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalItems: number = 0;
  allCertificateRequests: CertificateRequest[] = [];

  constructor(private authService: AuthService,
              private certificateRequestService: CertificateRequestService,
              private loadingService: LoadingService) {
  }

  ngOnInit(): void {
    this.fetchAllCertificateRequests();
  }

  fetchAllCertificateRequests() {
    this.loadingService.showMain();

    this.certificateRequestService.getAllCertificateRequests(this.currentPage - 1, this.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.loadingService.hideMain();

          this.allCertificateRequests = response.content;
          this.totalItems = response.totalElements;
        },
        error: (error: CustomError) => {
          this.loadingService.hideMain();

          console.error('Error fetching certificate requests', error);
        }
      })
  }

  onPageChanged(newPage: number) {
    this.currentPage = newPage;
    this.fetchAllCertificateRequests();
  }
}
