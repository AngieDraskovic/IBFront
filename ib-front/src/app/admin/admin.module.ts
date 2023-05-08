import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { AdminComponent } from './components/admin.component';
import {SharedModule} from "../shared/shared.module";
import {AdminRoutingModule} from "./admin-routing.module";


@NgModule({
  declarations: [
    AdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule {
}
