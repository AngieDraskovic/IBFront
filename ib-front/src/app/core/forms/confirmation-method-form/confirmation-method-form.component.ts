import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {TwoFAMethodRequest} from "../../models/two-fa-method-request";
import {SharedDataService} from "../../services/shared-data.service";
import {Subject, takeUntil} from "rxjs";
import {da} from "date-fns/locale";
import {LoadingService} from "../../services/loading.service";
import {TwoFactorAuthService} from "../../services/two-factor-auth.service";
import {NotificationService} from "../../services/notification.service";
import {LoginData} from "../../models/login-data";

@Component({
  selector: 'app-confirmation-method-form',
  templateUrl: './confirmation-method-form.component.html',
  styleUrls: ['./confirmation-method-form.component.css']
})
export class ConfirmationMethodFormComponent implements OnInit {
  private destroy$ = new Subject<void>();

  confirmationMethodForm = new FormGroup({
    confirmationMethod: new FormControl('', [Validators.required]),
  }, {});

  @Output() onBack = new EventEmitter<void>();
  @Output() onConfirmationMethodSubmit = new EventEmitter<void>();

  loginData?: LoginData | null;

  constructor(
    private sharedDataService: SharedDataService,
    private loadingService: LoadingService,
    private twoFactorAuthService: TwoFactorAuthService,
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
    if (this.confirmationMethodForm.invalid) {
      return;
    }

    const twoFaMethodRequest: TwoFAMethodRequest = {
      email: this.loginData?.email ?? '',
      method: this.confirmationMethodForm.controls['confirmationMethod'].value ?? ''
    }

    this.loadingService.show();

    this.twoFactorAuthService.select2FAMethod(twoFaMethodRequest).subscribe({
      next: () => {
        this.loadingService.hide();
        this.onConfirmationMethodSubmit.emit()
      },
      error: () => {
        this.loadingService.hide();
        this.notificationService.showDefaultError('tr');
      }
    });
  }

  reset() {
    this.confirmationMethodForm.reset();
  }

  navigateBack() {
    this.reset();
    this.onBack.emit();
  }
}
