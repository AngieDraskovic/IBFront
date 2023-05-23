import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {CertificatesComponent} from "./components/certificates/certificates.component";
import {AllCertificatesTableComponent} from "./components/all-certificates-table/all-certificates-table.component";
import {
  CertificateValidationDialogComponent
} from "./components/certificate-validation-dialog/certificate-validation-dialog.component";
import {MyCertificatesTableComponent} from "./components/my-certificates-table/my-certificates-table.component";
import {
  RevokeCertificateDialogComponent
} from "./components/revoke-certificate-dialog/revoke-certificate-dialog.component";
import {FormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";


@NgModule({
  declarations: [
    CertificatesComponent,
    CertificateValidationDialogComponent,
    RevokeCertificateDialogComponent,
    AllCertificatesTableComponent,
    MyCertificatesTableComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    NgOptimizedImage
  ],
  exports: [
    CertificatesComponent
  ]
})
export class CertificatesModule {
}
