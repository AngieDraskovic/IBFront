import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AdminComponent} from "./components/admin.component";
import {AuthGuard} from "../core/guards/auth.guard";
import {CertificatesComponent} from "../shared/components/certificates/certificates.component";
import {CertificateRequestsComponent} from "../shared/components/certificate-requests/certificate-requests.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin/ssl-certificates',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {roles: ['admin']},
    children: [
      { path: 'ssl-certificates', component: CertificatesComponent },
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
