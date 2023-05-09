import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from "./components/admin.component";
import {AuthGuard} from "../core/guards/auth.guard";
import {SslCertificatesComponent} from "../shared/components/ssl-certificates/ssl-certificates.component";
import {CertificateRequestsComponent} from "../shared/components/certificate-requests/certificate-requests.component";

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {roles: ['admin']},
    children: [
      { path: 'ssl-certificates', component: SslCertificatesComponent },
      { path: 'certificate-requests', component: CertificateRequestsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
}
