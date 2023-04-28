import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { LogRegComponent } from './components/log-reg/log-reg.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

const routes: Routes = [
  {path: '', component:LogRegComponent}, 
  {path: 'userHome', component:UserHomeComponent}, 
  {path: 'adminHome', component:AdminHomeComponent}, 
  {path: 'reset-password', component:ForgotPasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
