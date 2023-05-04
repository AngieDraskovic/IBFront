import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {LoginRegistrationComponent} from './components/login-registration/login-registration.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    LoginRegistrationComponent
  ],
  imports: [
    CommonModule,
    NgOptimizedImage,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    LoginRegistrationComponent
  ]
})
export class AuthModule {
}
