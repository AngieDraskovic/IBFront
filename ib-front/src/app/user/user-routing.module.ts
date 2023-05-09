import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from "./components/user.component";
import {AuthGuard} from "../core/guards/auth.guard";
import {LoginRegistrationComponent} from "../core/components/login-registration/login-registration.component";
import {SslCertificatesComponent} from "../shared/components/ssl-certificates/ssl-certificates.component";
import {CertificateRequestsComponent} from "../shared/components/certificate-requests/certificate-requests.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/user/ssl-certificates',
    pathMatch: 'full'
  },
  {
    path: '',
    component: UserComponent,
    canActivate: [AuthGuard],
    data: {roles: ['user']},
    children: [
      { path: 'ssl-certificates', component: SslCertificatesComponent },
      { path: 'certificate-requests', component: CertificateRequestsComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {
}
