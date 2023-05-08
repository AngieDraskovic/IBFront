import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {NavigationComponent} from './components/navigation/navigation.component';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {SslCertificatesComponent} from './components/ssl-certificates/ssl-certificates.component';
import {MatDialogModule} from "@angular/material/dialog";
import { CertificateValidationDialogComponent } from './components/certificate-validation-dialog/certificate-validation-dialog.component';


@NgModule({
  declarations: [
    NavigationComponent,
    SslCertificatesComponent,
    CertificateValidationDialogComponent
  ],
  exports: [
    NavigationComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    MatDialogModule
  ]
})
export class SharedModule {
}
