import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {NavigationComponent} from './components/navigation/navigation.component';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {CertificatesComponent} from './components/certificates/certificates.component';
import {MatDialogModule} from "@angular/material/dialog";
import { CertificateValidationDialogComponent } from './components/certificate-validation-dialog/certificate-validation-dialog.component';
import { RevokeCertificateDialogComponent } from './components/revoke-certificate-dialog/revoke-certificate-dialog.component';
import {FormsModule} from "@angular/forms";
import { CertificateRequestsComponent } from './components/certificate-requests/certificate-requests.component';
import { CreateRequestDialogComponent } from './components/create-request-dialog/create-request-dialog.component';
import {NgxPaginationModule} from "ngx-pagination";
import { MyCertificatesTableComponent } from './components/my-certificates-table/my-certificates-table.component';
import { AllCertificatesTableComponent } from './components/all-certificates-table/all-certificates-table.component';


@NgModule({
  declarations: [
    NavigationComponent,
    CertificatesComponent,
    CertificateValidationDialogComponent,
    RevokeCertificateDialogComponent,
    CertificateRequestsComponent,
    CreateRequestDialogComponent,
    MyCertificatesTableComponent,
    AllCertificatesTableComponent
  ],
  exports: [
    NavigationComponent
  ],
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        NgOptimizedImage,
        MatDialogModule,
        FormsModule,
        NgxPaginationModule
    ]
})
export class SharedModule {
}
