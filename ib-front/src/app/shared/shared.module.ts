import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {NavigationComponent} from './components/navigation/navigation.component';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {SslCertificatesComponent} from './components/ssl-certificates/ssl-certificates.component';
import {MatDialogModule} from "@angular/material/dialog";
import { CertificateValidationDialogComponent } from './components/certificate-validation-dialog/certificate-validation-dialog.component';
import { RevokeCertificateDialogComponent } from './components/revoke-certificate-dialog/revoke-certificate-dialog.component';
import {FormsModule} from "@angular/forms";
import { CertificateRequestsComponent } from './components/certificate-requests/certificate-requests.component';
import { CreateRequestDialogComponent } from './components/create-request-dialog/create-request-dialog.component';


@NgModule({
  declarations: [
    NavigationComponent,
    SslCertificatesComponent,
    CertificateValidationDialogComponent,
    RevokeCertificateDialogComponent,
    CertificateRequestsComponent,
    CreateRequestDialogComponent
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
        FormsModule
    ]
})
export class SharedModule {
}
