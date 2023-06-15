import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {NgToastService} from "ng-angular-popup";
import {Router} from "@angular/router";
import {Credentials} from "../../models/credentials";
import {UserRoleEnum} from "../../enums/user-role.enum";
import {CustomError} from "../../models/custom-error";
import {SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {OauthToken} from "../../models/oauth-token";
import {NotificationService} from "../../services/notification.service";
import {LoadingService} from "../../services/loading.service";
import {TwoFactorAuthService} from "../../services/two-factor-auth.service";
import {TwoFAMethodRequest} from "../../models/two-fa-method-request";
import {VerificationRequest} from "../../models/verification-request";
import {LoginResponse} from "../../models/login-response";
import {animate, query, style, transition, trigger} from "@angular/animations";
import {AuthFormComponent} from "../../forms/auth-form/auth-form.component";
import {MoreInfoFormComponent} from "../../forms/more-info-form/more-info-form.component";
import {ActivationFormComponent} from "../../forms/activation-form/activation-form.component";
import {LoginFormComponent} from "../../forms/login-form/login-form.component";
import {ConfirmationMethodFormComponent} from "../../forms/confirmation-method-form/confirmation-method-form.component";
import {OtpFormComponent} from "../../forms/otp-form/otp-form.component";

enum LoginStep {
  LoginForm,
  ResetPasswordForm,
  RenewPasswordForm,
  ConfirmationMethodForm,
  OTPForm
}

enum AnimationType {
  SLIDE_IN_LEFT = "slide-in-left",
  SLIDE_IN_RIGHT = "slide-in-right"
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  protected readonly LoginStep = LoginStep;
  @ViewChild(LoginFormComponent) loginForm!: LoginFormComponent;
  @ViewChild(ConfirmationMethodFormComponent) confirmationMethodForm!: ConfirmationMethodFormComponent;
  @ViewChild(OtpFormComponent) otpForm!: OtpFormComponent;

  currentStep: LoginStep = LoginStep.LoginForm;
  animationType: AnimationType = AnimationType.SLIDE_IN_RIGHT;

  constructor(public loadingService: LoadingService) {
  }

  ngOnInit(): void {
  }

  navigateToRenewPassword() {
    this.animationType = AnimationType.SLIDE_IN_RIGHT;
    this.loginForm.reset();
    this.currentStep = LoginStep.RenewPasswordForm;
  }

  navigateToResetPassword() {
    this.animationType = AnimationType.SLIDE_IN_RIGHT;
    this.loginForm.reset();
    this.currentStep = LoginStep.ResetPasswordForm;
  }

  nextStep() {
    this.animationType = AnimationType.SLIDE_IN_RIGHT;
    switch (this.currentStep) {
      case LoginStep.LoginForm:
        this.currentStep = LoginStep.ConfirmationMethodForm;
        this.loginForm.reset();
        break;
      case LoginStep.RenewPasswordForm:
      case LoginStep.ResetPasswordForm:
        this.currentStep = LoginStep.LoginForm;
        this.loginForm.reset();
        break;
      case LoginStep.ConfirmationMethodForm:
        this.currentStep = LoginStep.OTPForm;
        this.confirmationMethodForm.reset();
        break;
      case LoginStep.OTPForm:
        this.currentStep = LoginStep.OTPForm;
        this.otpForm.reset();
        break;
    }
  }

  onBack() {
    this.animationType = AnimationType.SLIDE_IN_LEFT;

    switch (this.currentStep) {
      case LoginStep.ConfirmationMethodForm:
        this.currentStep = LoginStep.LoginForm;
        break;
      case LoginStep.RenewPasswordForm:
      case LoginStep.ResetPasswordForm:
        this.currentStep = LoginStep.LoginForm;
        break;
      case LoginStep.OTPForm:
        this.currentStep = LoginStep.ConfirmationMethodForm;
        break;
    }
  }
}
