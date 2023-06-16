import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {Router} from "@angular/router";
import {NotificationService} from "../../services/notification.service";
import {Credentials} from "../../models/credentials";
import {UserRoleEnum} from "../../enums/user-role.enum";
import {CustomError} from "../../models/custom-error";
import {OauthToken} from "../../models/oauth-token";
import {RecaptchaComponent} from "ng-recaptcha";
import {LoginResponse} from "../../models/login-response";
import {LoadingService} from "../../services/loading.service";
import {SharedDataService} from "../../services/shared-data.service";
import {LoginData} from "../../models/login-data";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  siteKey = '6Le54BwmAAAAAO5Wppw-q7bP4I1rKwZoZ1c_fWyV';
  recaptchaToken: string = '';
  @ViewChild('recaptchaElement') captchaRef!: RecaptchaComponent;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
    recaptcha: new FormControl('', [Validators.required])
  });

  @Output() onBack = new EventEmitter<void>();
  @Output() onLoginSubmit = new EventEmitter<void>();
  @Output() onResetPassword = new EventEmitter<void>();
  @Output() renewPasswordRequired = new EventEmitter<void>();

  constructor(
    private loadingService: LoadingService,
    private sharedService: SharedDataService,
    private userService: UserService,
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private notificationService: NotificationService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      if (user != null) {
        this.loginWithGoogle(user);
      }
    });
  }

  forgotPassword() {
    if (this.loginForm.controls['email'].invalid) {
      this.notificationService.showWarning("Email is required", "Please enter your email in correct format", 'tr');
      return
    }

    this.loadingService.show();

    const email = this.loginForm.controls['email'].value ?? '';
    this.userService.sendMailForPasswordReset(email).subscribe({
      next: () => {
        this.loadingService.hide();

        const loginData: LoginData = {
          email: email,
          temporaryToken: ''
        }
        this.sharedService.setLoginData(loginData);
        this.onResetPassword.emit();
      },
      error: (error: CustomError) => {
        this.loadingService.hide();

        if (error.status == 404) {
          this.notificationService.showWarning("Invalid email", "Entered email does not exist", 'tr');
        } else {
          this.notificationService.showDefaultError('tr');
        }
      }
    });
  }

  onFormSubmit() {
    if (this.loginForm.valid) {
      const credentials: Credentials = {
        email: this.loginForm.controls['email'].value ?? '',
        password: this.loginForm.controls['password'].value ?? '',
        recaptchaToken: this.recaptchaToken
      };

      this.loadingService.show();

      this.authService.login(credentials).subscribe({
        next: (loginResponse: LoginResponse) => {
          this.loginForm.reset();
          this.loadingService.hide();

          const loginData: LoginData = {
            email: credentials.email,
            temporaryToken: loginResponse.temporaryToken
          }
          this.sharedService.setLoginData(loginData);

          if (loginResponse.passwordExpired) {
            this.renewPasswordRequired.emit();
          } else {
            this.onLoginSubmit.emit();
          }
        },
        error: (error: CustomError) => {
          this.captchaRef.reset();
          this.loadingService.hide();

          if (error.status == 401 || error.status == 403) {
            this.notificationService.showWarning("Warning", error.message, 'tr');
          } else {
            this.notificationService.showDefaultError('tr');
          }
        }
      });
    }
  }

  loginWithGoogle(user: SocialUser) {
    this.loadingService.show();
    const oauthToken: OauthToken = {token: user.idToken};
    this.authService.loginWithGoogle(oauthToken).subscribe({
        next: () => {
          this.loadingService.hide();

          const userRole = this.authService.getUserRole();
          if (userRole === UserRoleEnum.Admin) {
            this.router.navigate(['/admin']);
          } else if (userRole === UserRoleEnum.User) {
            this.router.navigate(['/user']);
          }
        },
        error: (error: CustomError) => {
          this.loadingService.hide();

          if (error.status == 403) {
            this.notificationService.showWarning("Warning", error.message, 'tr');
          } else {
            this.notificationService.showDefaultError('tr');
          }
        }
      }
    );
  }

  handleRecaptchaResponse(response: string) {
    this.recaptchaToken = response;
  }

  reset() {
    this.loginForm.reset();
    this.captchaRef.reset();
  }
}
