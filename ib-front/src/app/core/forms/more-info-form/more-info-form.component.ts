import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SharedDataService} from "../../services/shared-data.service";
import {Subject, takeUntil} from "rxjs";
import {RegistrationData} from "../../models/registration-data";
import {RegistrationService} from "../../services/registration.service";
import {LoadingService} from "../../services/loading.service";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-more-info-form',
  templateUrl: './more-info-form.component.html',
  styleUrls: ['./more-info-form.component.css']
})
export class MoreInfoFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  siteKey = '6Le54BwmAAAAAO5Wppw-q7bP4I1rKwZoZ1c_fWyV';
  recaptchaToken: string = '';

  allTextPattern = "[a-zA-Z][a-zA-Z]*";
  phoneNumberPattern = "[0-9 +]?[0-9]+[0-9 \\-]+";

  moreInfoForm = new FormGroup({
    name: new FormControl('', [Validators.pattern(this.allTextPattern), Validators.required]),
    surname: new FormControl('', [Validators.pattern(this.allTextPattern), Validators.required]),
    telephoneNumber: new FormControl('', [Validators.required, Validators.pattern(this.phoneNumberPattern)]),
    confirmationMethod: new FormControl('', Validators.required),
    recaptcha: new FormControl('', [Validators.required])
  }, {});

  @Output() onMoreInfoSubmit = new EventEmitter<void>();
  @Output() onBack = new EventEmitter<void>();

  authData?: { email: string; password: string } | null;

  constructor(
    private sharedDataService: SharedDataService,
    private registrationService: RegistrationService,
    private loadingService: LoadingService,
    private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.sharedDataService.authData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.authData = data;
      });
  }

  handleRecaptchaResponse(response: string) {
    this.recaptchaToken = response;
  }

  onFormSubmit() {
    if (this.moreInfoForm.invalid || this.authData == null) {
      return;
    }

    const registrationData: RegistrationData = {
      email: this.authData.email,
      password: this.authData.password,
      name: this.moreInfoForm.controls['name'].value ?? '',
      surname: this.moreInfoForm.controls['surname'].value ?? '',
      telephoneNumber: this.moreInfoForm.controls['telephoneNumber'].value ?? '',
      confirmationMethod: this.moreInfoForm.controls['confirmationMethod'].value as 'Email' | 'SMS' ?? '',
      recaptchaToken: this.recaptchaToken
    }

    this.loadingService.show();
    this.registrationService.register(registrationData, registrationData.confirmationMethod).subscribe({
      next: () => {
        this.loadingService.hide();
        this.sharedDataService.setAuthData(null);

        let contactDetails = registrationData.confirmationMethod === 'Email' ? registrationData.email : registrationData.telephoneNumber;
        this.sharedDataService.setConfirmationMethod({
          confirmationMethod: registrationData.confirmationMethod,
          contactDetail: contactDetails
        })

        this.onMoreInfoSubmit.emit();
      },
      error: () => {
        this.loadingService.hide();
        this.notificationService.showDefaultError('tl');
      }
    });
  }

  navigateBack() {
    this.onBack.emit();
    this.reset();
  }

  reset() {
    this.moreInfoForm.reset();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
