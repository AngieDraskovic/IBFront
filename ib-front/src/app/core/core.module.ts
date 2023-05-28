import {NgModule,  NO_ERRORS_SCHEMA } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {Home} from './components/home/home';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthService} from "./services/auth.service";
import {AuthGuard} from "./guards/auth.guard";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { RecaptchaModule } from 'ng-recaptcha';
import { ReCaptchaValueAccessorDirective } from 'src/app/shared/utilities/recaptcha-value-accessor';
import {AuthInterceptor} from "./interceptors/auth.interceptor";
import {GoogleSigninButtonModule} from "@abacritt/angularx-social-login";
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {SharedModule} from "../shared/shared.module";
import { OtpFormComponent } from './forms/otp-form/otp-form.component';
import { AuthFormComponent } from './forms/auth-form/auth-form.component';
import { MoreInfoFormComponent } from './forms/more-info-form/more-info-form.component';
import { ActivationFormComponent } from './forms/activation-form/activation-form.component';
import { LoginFormComponent } from './forms/login-form/login-form.component';
import { ConfirmationMethodFormComponent } from './forms/confirmation-method-form/confirmation-method-form.component';


@NgModule({
  declarations: [
    Home,
    ReCaptchaValueAccessorDirective,
    LoginComponent,
    RegisterComponent,
    OtpFormComponent,
    AuthFormComponent,
    MoreInfoFormComponent,
    ActivationFormComponent,
    LoginFormComponent,
    ConfirmationMethodFormComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    RecaptchaModule,
    GoogleSigninButtonModule,
    SharedModule,
    FormsModule
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
    Home
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class CoreModule {
}
