import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SharedDataService} from "../../services/shared-data.service";
import {UserService} from "../../services/user.service";
import {LoadingService} from "../../services/loading.service";
import {NotificationService} from "../../services/notification.service";
import {anonymizeEmail, anonymizePhoneNumber} from "../../../shared/utilities/anonymizer.util";
import {LoginData} from "../../models/login-data";
import {RenewPassword} from "../../models/renew-password";
import {match} from "../../../shared/utilities/match.validator";
import {CustomError} from "../../models/custom-error";

@Component({
  selector: 'app-renew-password-form',
  templateUrl: './renew-password-form.component.html',
  styleUrls: ['./renew-password-form.component.css']
})
export class RenewPasswordFormComponent implements OnInit {
  private destroy$ = new Subject<void>();

  renewPasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required,])
  }, {validators: [match('password', 'confirmPassword')]});


  @Output() onBack = new EventEmitter<void>();
  @Output() onRenewSubmit = new EventEmitter<void>();

  loginData?: LoginData | null;

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
        this.loginData = data;
      });
  }

  onFormSubmit() {
    if (this.renewPasswordForm.invalid || this.loginData == null) {
      return;
    }

    const renewPassword: RenewPassword = {
      newPassword: this.renewPasswordForm.controls['password'].value ?? '',
      newPasswordConfirm: this.renewPasswordForm.controls['confirmPassword'].value ?? '',
      temporaryToken: this.loginData?.temporaryToken,
    }

    this.loadingService.show();
    this.userService.renewPassword(this.loginData?.email, renewPassword).subscribe({
      next: () => {
        this.loadingService.hide();

        this.reset();
        this.sharedDataService.setAuthData(null);
        this.onRenewSubmit.emit();

        setTimeout(() => {
          this.notificationService.showSuccess(
            "Renew successful",
            "You can now log in using your new credentials",
            'tr'
          );
        }, 1000);
      },
      error: (error: CustomError) => {
        this.loadingService.hide();
        if (error.status == 400) {
          this.notificationService.showWarning('Password already used', 'You already used that password', 'tr');
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
    this.renewPasswordForm.reset();
  }
}
