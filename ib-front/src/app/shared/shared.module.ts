import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {NavigationComponent} from '../core/components/navigation/navigation.component';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgxPaginationModule} from "ngx-pagination";
import {DropdownComponent} from './components/dropdown/dropdown.component';
import {FormFieldComponent} from './components/form-field/form-field.component';
import {FormButtonComponent} from './components/form-button/form-button.component';
import {BackButtonComponent} from './components/back-button/back-button.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SpinnerBackgroundedComponent } from './components/spinner-backgrounded/spinner-backgrounded.component';


@NgModule({
  declarations: [
    NavigationComponent,
    DropdownComponent,
    FormFieldComponent,
    FormButtonComponent,
    BackButtonComponent,
    SpinnerComponent,
    SpinnerBackgroundedComponent
  ],
    exports: [
        NavigationComponent,
        DropdownComponent,
        FormFieldComponent,
        FormButtonComponent,
        BackButtonComponent,
        SpinnerComponent,
        SpinnerBackgroundedComponent
    ],
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage,
    MatDialogModule,
    FormsModule,
    NgxPaginationModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {
}
