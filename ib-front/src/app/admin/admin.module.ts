import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {AdminComponent} from './components/admin.component';
import {SharedModule} from "../shared/shared.module";
import {AdminRoutingModule} from "./admin-routing.module";
import {CertificatesModule} from "../features/certificates/certificates.module";
import {CertificateRequestsModule} from "../features/certificate-requests/certificate-requests.module";


@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    NgOptimizedImage,
    CertificatesModule,
    CertificateRequestsModule
  ]
})
export class AdminModule {
}
