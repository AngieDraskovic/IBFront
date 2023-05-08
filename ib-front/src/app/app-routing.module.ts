import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginRegistrationComponent} from "./core/components/login-registration/login-registration.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login-register',
    pathMatch: 'full'
  },
  {
    path: 'login-register',
    component: LoginRegistrationComponent,
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
