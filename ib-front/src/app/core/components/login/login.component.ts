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

  userEmail?: string;
  temporaryToken?: string;

  constructor(private router: Router,
              public loadingService: LoadingService,
              private authService: AuthService,
              private twoFactorAuthService: TwoFactorAuthService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

  handleLoginFormSubmit(credentials: Credentials) {
    this.loadingService.show();

    this.authService.login(credentials).subscribe({
      next: (loginResponse: LoginResponse) => {
        this.loginForm.reset();
        this.loadingService.hide();

        this.userEmail = credentials.email;
        this.temporaryToken = loginResponse.temporaryToken;

        this.nextStep()
      },
      error: (error: CustomError) => {
        this.loadingService.hide();

        if (error.status == 401 || error.status == 403) {
          this.notificationService.showWarning("Warning", error.message, 'tr');
        } else {
          this.notificationService.showDefaultError('tr');
        }
      }
    });
  }

  handleConfirmationMethodFormSubmit(method: string) {
    if (this.userEmail == null) {
      return;
    }

    const twoFaMethodRequest: TwoFAMethodRequest = {
      email: this.userEmail,
      method: method
    }

    this.loadingService.show();

    this.twoFactorAuthService.select2FAMethod(twoFaMethodRequest).subscribe({
      next: () => {
        this.loadingService.hide();

        this.nextStep()
      },
      error: () => {
        this.loadingService.hide();
        this.notificationService.showDefaultError('tr');
      }
    });
  }

  handleOTPFormSubmit(otp: string) {
    if (this.userEmail == null || this.temporaryToken == null) {
      return;
    }

    const verificationRequest: VerificationRequest = {
      email: this.userEmail,
      code: otp,
      temporaryToken: this.temporaryToken
    }

    this.loadingService.show();

    this.twoFactorAuthService.verify2FA(verificationRequest).subscribe({
      next: (authToken) => {
        this.loadingService.hide();

        this.authService.handleAuthResponse(authToken);
        if (this.authService.getUserRole() === UserRoleEnum.Admin) {
          this.router.navigate(['/admin']);
        } else if (this.authService.getUserRole() === UserRoleEnum.User) {
          this.router.navigate(['/user']);
        }
      },
      error: (error) => {
        this.loadingService.hide();
        this.notificationService.showDefaultError('tr');
      }
    });
  }

  nextStep() {
    this.animationType = AnimationType.SLIDE_IN_RIGHT;
    switch (this.currentStep) {
      case LoginStep.LoginForm:
        this.currentStep = LoginStep.ConfirmationMethodForm;
        break;
      case LoginStep.ConfirmationMethodForm:
        this.currentStep = LoginStep.OTPForm;
        break;
    }
  }

  onBack() {
    this.animationType = AnimationType.SLIDE_IN_LEFT;

    switch (this.currentStep) {
      case LoginStep.ConfirmationMethodForm:
        this.userEmail = undefined;
        this.temporaryToken = undefined;
        this.currentStep = LoginStep.LoginForm;
        break;
      case LoginStep.OTPForm:
        this.currentStep = LoginStep.ConfirmationMethodForm;
        break;
    }
  }
}
