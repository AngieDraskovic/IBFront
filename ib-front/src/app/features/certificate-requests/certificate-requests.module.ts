import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {
  AllCertificateRequestsComponent
} from './components/all-certificate-requests/all-certificate-requests.component';
import {
  AllCertificateRequestsTableComponent
} from './components/all-certificate-requests-table/all-certificate-requests-table.component';
import {NgxPaginationModule} from "ngx-pagination";
import {CertificateRequestsComponent} from "./components/certificate-requests/certificate-requests.component";
import {
  CreateCertificateRequestDialogComponent
} from "./components/create-certificate-request-dialog/create-certificate-request-dialog.component";
import {
  IncomingCertificateRequestsTableComponent
} from "./components/incoming-certificate-requests-table/incoming-certificate-requests-table.component";
import {
  OutgoingCertificateRequestsTableComponent
} from "./components/outgoing-certificate-requests-table/outgoing-certificate-requests-table.component";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    CertificateRequestsComponent,
    AllCertificateRequestsComponent,
    CreateCertificateRequestDialogComponent,
    AllCertificateRequestsTableComponent,
    IncomingCertificateRequestsTableComponent,
    OutgoingCertificateRequestsTableComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    NgxPaginationModule,
    FormsModule
  ],
  exports: [
    CertificateRequestsComponent,
    AllCertificateRequestsComponent
  ]
})
export class CertificateRequestsModule {
}
