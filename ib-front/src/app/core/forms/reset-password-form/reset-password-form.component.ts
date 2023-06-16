import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {match} from "../../../shared/utilities/match.validator";
import {SharedDataService} from "../../services/shared-data.service";
import {UserService} from "../../services/user.service";
import {LoadingService} from "../../services/loading.service";
import {NotificationService} from "../../services/notification.service";
import {CustomError} from "../../models/custom-error";
import {ResetPassword} from "../../models/reset-password";
import {RecaptchaComponent} from "ng-recaptcha";
import {th} from "date-fns/locale";

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.css']
})
export class ResetPasswordFormComponent implements OnInit {
  siteKey = '6Le54BwmAAAAAO5Wppw-q7bP4I1rKwZoZ1c_fWyV';
  recaptchaToken: string = '';
  @ViewChild('recaptchaElement') captchaRef!: RecaptchaComponent;

  private destroy$ = new Subject<void>();

  resetPasswordForm = new FormGroup({
    code: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required,]),
    recaptcha: new FormControl('', [Validators.required])
  }, {validators: [match('password', 'confirmPassword')]});


  @Output() onBack = new EventEmitter<void>();
  @Output() onResetSubmit = new EventEmitter<void>();

  email?: string | null;

  constructor(
    private sharedDataService: SharedDataService,
    private userService: UserService,
    private loadingService: LoadingService,
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.sharedDataService.loginData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.email = data?.email;
      });
  }

  onFormSubmit() {
    if (this.resetPasswordForm.invalid || this.email == null) {
      return;
    }

    const resetPassword: ResetPassword = {
      newPassword: this.resetPasswordForm.controls['password'].value ?? '',
      newPasswordConfirm: this.resetPasswordForm.controls['confirmPassword'].value ?? '',
      code: this.resetPasswordForm.controls['code'].value ?? '',
      recaptchaToken: this.recaptchaToken
    }

    this.loadingService.show();
    this.userService.resetPassword(this.email, resetPassword).subscribe({
      next: () => {
        this.loadingService.hide();

        this.reset();
        this.sharedDataService.setAuthData(null);
        this.onResetSubmit.emit();

        setTimeout(() => {
          this.notificationService.showSuccess(
            "Reset successful",
            "You can now log in using your new credentials",
            'tr'
          );
        }, 1000);
      },
      error: (error: CustomError) => {
        this.loadingService.hide();
        this.captchaRef.reset();
        this.recaptchaToken = '';
        this.resetPasswordForm.controls['recaptcha'].reset();

        if (error.status == 404) {
          this.notificationService.showWarning('Invalid code', 'The code you entered is invalid', 'tr');
        } else if (error.status == 400) {
          this.notificationService.showWarning('Repeated password', 'You have already used that password', 'tr');
        } else {
          this.notificationService.showDefaultError('tr');
        }
      }
    });
  }


  navigateBack() {
    this.onBack.emit();
    this.reset();
  }

  handleRecaptchaResponse(response: string) {
    this.recaptchaToken = response;
  }

  reset() {
    this.resetPasswordForm.reset();
    this.recaptchaToken = '';
    this.captchaRef.reset();
  }
}
