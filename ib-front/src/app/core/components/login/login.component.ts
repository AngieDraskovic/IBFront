import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {NgToastService} from "ng-angular-popup";
import {Router} from "@angular/router";
import {Credentials} from "../../models/credentials";
import {UserRoleEnum} from "../../enums/user-role.enum";
import {CustomError} from "../../models/custom-error";
import {SocialAuthService, SocialUser} from "@abacritt/angularx-social-login";
import {OauthToken} from "../../models/oauth-token";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
    recaptcha: new FormControl('', [Validators.required])
  });

  @Input() siteKey: string = '';
  recaptchaToken: string = '';

  constructor(private authService: AuthService,
              private socialAuthService: SocialAuthService,
              private toastService: NgToastService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.socialAuthService.authState.subscribe((user) => {
      if (user != null) {
        this.loginWithGoogle(user);
      }
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials: Credentials = {
      email: this.loginForm.controls['email'].value ?? '',
      password: this.loginForm.controls['password'].value ?? '',
      recaptchaToken: this.recaptchaToken
    };


    this.authService.login(credentials).subscribe({
      next: () => {
        const user = this.authService.currentUserValue;
        if (user?.role === UserRoleEnum.Admin) {
          this.router.navigate(['/admin']);
        } else if (user?.role === UserRoleEnum.User) {
          this.router.navigate(['/user']);
        }
      },
      error: (error: CustomError) => {
        this.toastService.error({
          detail: "Error",
          summary: error.message,
          duration: 5000
        });
      }
    });
  }

  loginWithGoogle(user: SocialUser) {
    const oauthToken: OauthToken = {token: user.idToken};
    this.authService.loginWithGoogle(oauthToken).subscribe({
        next: () => {
          const user = this.authService.currentUserValue;
          if (user?.role === UserRoleEnum.Admin) {
            this.router.navigate(['/admin']);
          } else if (user?.role === UserRoleEnum.User) {
            this.router.navigate(['/user']);
          }
        },
        error: (error: CustomError) => {
          if (error.status == 401 || error.status == 403) {
            this.toastService.warning({
              detail: "Warning",
              summary: error.message,
              duration: 5000
            });
          } else {
            this.toastService.error({
              detail: "Error",
              summary: "Something went wrong.",
              duration: 5000
            });
          }
        }
      }
    );
  }

  handleRecaptchaResponse(response: string) {
    this.recaptchaToken = response;
  }
}
