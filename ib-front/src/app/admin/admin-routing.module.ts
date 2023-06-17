import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from "./components/admin.component";
import {AuthGuard} from "../core/guards/auth.guard";
import {CertificatesComponent} from "../features/certificates/components/certificates/certificates.component";
import {CertificateRequestsComponent} from "../features/certificate-requests/components/certificate-requests/certificate-requests.component";
import {
  AllCertificateRequestsComponent
} from "../features/certificate-requests/components/all-certificate-requests/all-certificate-requests.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin/certificates',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {roles: ['admin']},
    children: [
      { path: 'certificates', component: CertificatesComponent },
      { path: 'certificate-requests', component: CertificateRequestsComponent },
      { path: 'all-certificate-requests', component: AllCertificateRequestsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
}
