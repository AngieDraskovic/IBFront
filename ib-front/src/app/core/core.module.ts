import {NgModule,  NO_ERRORS_SCHEMA } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {LoginRegistrationComponent} from './components/login-registration/login-registration.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "./services/auth.service";
import {AuthGuard} from "./guards/auth.guard";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TokenInterceptor} from "./interceptors/token.interceptor";
import { RecaptchaModule } from 'ng-recaptcha';
import { ReCaptchaValueAccessorDirective } from 'src/app/shared/utilities/recaptcha-value-accessor';
import {AuthInterceptor} from "./interceptors/auth.interceptor";


@NgModule({
  declarations: [
    LoginRegistrationComponent,
    ReCaptchaValueAccessorDirective
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    RecaptchaModule
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  exports: [
    LoginRegistrationComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class CoreModule {
}
