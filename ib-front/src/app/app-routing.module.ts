import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { LogRegComponent } from './components/log-reg/log-reg.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';

const routes: Routes = [
  {path: '', component:LogRegComponent}, 
  {path: 'userHome', component:UserHomeComponent}, 
  {path: 'adminHome', component:AdminHomeComponent}, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
