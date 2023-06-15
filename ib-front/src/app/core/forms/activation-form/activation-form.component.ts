import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {NotificationService} from "../../services/notification.service";
import {anonymizeEmail, anonymizePhoneNumber} from "../../../shared/utilities/anonymizer.util";
import {LoadingService} from "../../services/loading.service";
import {UserService} from "../../services/user.service";
import {SharedDataService} from "../../services/shared-data.service";
import {RegistrationService} from "../../services/registration.service";
import {Subject, takeUntil} from "rxjs";
import {CustomError} from "../../models/custom-error";

@Component({
  selector: 'app-activation-form',
  templateUrl: './activation-form.component.html',
  styleUrls: ['./activation-form.component.css']
})
export class ActivationFormComponent implements OnInit {
  private destroy$ = new Subject<void>();

  activationForm = new FormGroup({
    code: new FormControl('', [Validators.required])
  }, {});

  confirmationData?: { confirmationMethod: 'Email' | 'SMS', contactDetail: string } | null;
  @Output() onBack = new EventEmitter<void>();
  @Output() onActivationSubmit = new EventEmitter<void>();
  anonymizedContact!: string;
  confirmationMessage!: string;

  constructor(
    private sharedDataService: SharedDataService,
    private userService: UserService,
    private loadingService: LoadingService,
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.sharedDataService.confirmationMethod$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.confirmationData = data;
        this.updateView()
      });
  }

  updateView() {
    if (this.confirmationData == null) {
      this.confirmationMessage = "To proceed with the activation, please enter the verification code that was sent to you";
      return;
    }

    if (this.confirmationData.confirmationMethod === 'Email') {
      this.anonymizedContact = anonymizeEmail(this.confirmationData.contactDetail);
      this.confirmationMessage = "Confirm your email address by entering the code we've sent you to";
    } else if (this.confirmationData.confirmationMethod === 'SMS') {
      this.anonymizedContact = anonymizePhoneNumber(this.confirmationData.contactDetail);
      this.confirmationMessage = "Confirm your phone number by entering the code we've sent you to";
    }
  }

  onFormSubmit() {
    if (this.activationForm.invalid) {
      return;
    }

    this.loadingService.show();
    this.userService.activateUserAccount(this.activationForm.controls['code'].value ?? '').subscribe({
      next: () => {
        this.loadingService.hide();

        this.reset();
        this.sharedDataService.setAuthData(null);
        this.onActivationSubmit.emit();

        setTimeout(() => {
          this.notificationService.showSuccess(
            "Activation successful",
            "You can now log in using your credentials on login page :)",
            'tl');
        }, 1000);
      },
      error: (error: CustomError) => {
        this.loadingService.hide();
        if (error.status == 400) {
          this.notificationService.showWarning(
            "Invalid code",
            "The code you entered is invalid",
            'tl');
        } else {
          this.notificationService.showDefaultError('tl');
        }
      }
    });
  }

  navigateBack() {
    this.onBack.emit();
    this.reset();
  }

  reset() {
    this.activationForm.reset();
    this.confirmationData = null;
    this.anonymizedContact = "";
    this.updateView();
  }
}
