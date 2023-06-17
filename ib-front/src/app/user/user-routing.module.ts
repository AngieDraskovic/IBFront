import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from "./components/user.component";
import {AuthGuard} from "../core/guards/auth.guard";
import {Home} from "../core/components/home/home";
import {CertificatesComponent} from "../features/certificates/components/certificates/certificates.component";
import {CertificateRequestsComponent} from "../features/certificate-requests/components/certificate-requests/certificate-requests.component";

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
      { path: 'ssl-certificates', component: CertificatesComponent },
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
