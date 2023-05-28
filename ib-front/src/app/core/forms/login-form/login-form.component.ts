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

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit{
  siteKey = '6Le54BwmAAAAAO5Wppw-q7bP4I1rKwZoZ1c_fWyV';
  recaptchaToken: string = '';
  @ViewChild('recaptchaElement') captchaRef!: RecaptchaComponent;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
    recaptcha: new FormControl('', [Validators.required])
  });

  @Output() onBack = new EventEmitter<any>();
  @Output() onLoginSubmit = new EventEmitter<any>();

  constructor(private authService: AuthService,
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

  onFormSubmit() {
    if (this.loginForm.valid) {
      const credentials: Credentials = {
        email: this.loginForm.controls['email'].value ?? '',
        password: this.loginForm.controls['password'].value ?? '',
        recaptchaToken: this.recaptchaToken
      };

      this.onLoginSubmit.emit(credentials);
    }
  }

  loginWithGoogle(user: SocialUser) {
    const oauthToken: OauthToken = {token: user.idToken};
    this.authService.loginWithGoogle(oauthToken).subscribe({
        next: () => {
          const userRole = this.authService.getUserRole();
          if (userRole === UserRoleEnum.Admin) {
            this.router.navigate(['/admin']);
          } else if (userRole === UserRoleEnum.User) {
            this.router.navigate(['/user']);
          }
        },
        error: (error: CustomError) => {
          if (error.status == 401 || error.status == 403) {
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
