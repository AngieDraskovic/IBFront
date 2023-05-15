import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {NavigationComponent} from '../core/components/navigation/navigation.component';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";


@NgModule({
  declarations: [
    NavigationComponent
  ],
  exports: [
    NavigationComponent
  ],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    MatDialogModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class SharedModule {
}
