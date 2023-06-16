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
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RecaptchaModule} from "ng-recaptcha";
import {SharedModule} from "../../shared/shared.module";


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
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,
    SharedModule
  ],
  exports: [
    CertificateRequestsComponent,
    AllCertificateRequestsComponent
  ]
})
export class CertificateRequestsModule {
}
