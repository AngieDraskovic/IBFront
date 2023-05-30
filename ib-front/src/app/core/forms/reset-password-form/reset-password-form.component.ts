import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {match} from "../../../shared/utilities/match.validator";
import {SharedDataService} from "../../services/shared-data.service";
import {UserService} from "../../services/user.service";
import {LoadingService} from "../../services/loading.service";
import {NotificationService} from "../../services/notification.service";
import {CustomError} from "../../models/custom-error";
import {ResetPassword} from "../../models/reset-password";

@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.css']
})
export class ResetPasswordFormComponent implements OnInit {
  private destroy$ = new Subject<void>();

  resetPasswordForm = new FormGroup({
    code: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required,])
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

  reset() {
    this.resetPasswordForm.reset();
  }
}
