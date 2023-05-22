import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {NgToastService} from "ng-angular-popup";
import {RegistrationData} from "../../models/registration-data";
import {CustomError} from "../../models/custom-error";
import {match} from "../../../shared/utilities/match.validator";
import {anonymizeEmail, anonymizePhoneNumber} from "../../../shared/utilities/anonymizer.util";

enum ActiveForm {
  AUTH = "auth",
  ADDITIONAL_INFORMATION = "additional_information",
  ACCOUNT_ACTIVATION = "account_activation"
}

enum AnimationType {
  SLIDE_IN_LEFT = "slide-in-left",
  SLIDE_IN_RIGHT = "slide-in-right"
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  protected readonly ActiveForm = ActiveForm;

  allTextPattern = "[a-zA-Z][a-zA-Z]*";
  phoneNumberPattern = "[0-9 +]?[0-9]+[0-9 \\-]+";

  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required,])
  }, {validators: [match('password', 'confirmPassword')]});

  moreInfoForm = new FormGroup({
    name: new FormControl('', [Validators.pattern(this.allTextPattern), Validators.required]),
    surname: new FormControl('', [Validators.pattern(this.allTextPattern), Validators.required]),
    telephoneNumber: new FormControl('', [Validators.required, Validators.pattern(this.phoneNumberPattern), Validators.minLength(9), Validators.maxLength(20)]),
    confirmationMethod: new FormControl('', Validators.required),
    recaptcha: new FormControl('', [Validators.required])
  }, {});

  activationForm = new FormGroup({
    code: new FormControl('', [Validators.required])
  }, {});

  @Input() siteKey: string = '';
  recaptchaToken: string = '';

  activeForm: ActiveForm = ActiveForm.AUTH;
  animationType: AnimationType = AnimationType.SLIDE_IN_RIGHT;

  anonymizedContact: string = '';
  confirmationMessage: string = '';

  constructor(private authService: AuthService,
              private toastService: NgToastService) {
  }

  ngOnInit(): void {
  }

  next(): void {
    this.animationType = AnimationType.SLIDE_IN_RIGHT;

    switch (this.activeForm) {
      case ActiveForm.AUTH:
        this.checkEmailExistsAndProceed(this.authForm.controls['email'].value);
        break;
      case ActiveForm.ADDITIONAL_INFORMATION:
        this.activeForm = ActiveForm.ADDITIONAL_INFORMATION;
        break;
    }
  }

  back(): void {
    this.animationType = AnimationType.SLIDE_IN_LEFT;

    switch (this.activeForm) {
      case ActiveForm.ADDITIONAL_INFORMATION:
        this.activeForm = ActiveForm.AUTH;
        break;
    }
  }

  checkEmailExistsAndProceed(email: string | null) {
    if (email == null) {
      return;
    }

    this.authService.checkEmail(email).subscribe(
      {
        next: (emailExists) => {
          if (emailExists) {
            this.toastService.warning({
              detail: "Email taken",
              summary: "Email already in use",
              position: "tl",
              duration: 5000
            });
          } else {
            this.activeForm = ActiveForm.ADDITIONAL_INFORMATION;
          }
        },
        error: (error: CustomError) => {
          this.toastService.error({
            detail: "Error",
            summary: "Something went wrong.",
            position: "tl",
            duration: 5000
          });
        }
      }
    );
  }

  register() {
    if (this.authForm.invalid || this.moreInfoForm.invalid) {
      return;
    }

    const registrationData: RegistrationData = {
      name: this.moreInfoForm.controls['name'].value ?? '',
      surname: this.moreInfoForm.controls['surname'].value ?? '',
      email: this.authForm.controls['email'].value ?? '',
      telephoneNumber: this.moreInfoForm.controls['telephoneNumber'].value ?? '',
      password: this.authForm.controls['password'].value ?? '',
      recaptchaToken: this.recaptchaToken
    };

    this.authService.register(registrationData, this.moreInfoForm.controls['confirmationMethod'].value ?? '').subscribe({
      next: () => {
        this.activeForm = ActiveForm.ACCOUNT_ACTIVATION;

        let confirmationMethod = this.moreInfoForm.controls['confirmationMethod'].value;
        if (confirmationMethod === 'Email') {
          this.anonymizedContact = anonymizeEmail(registrationData.email);
          this.confirmationMessage = "Confirm your email address by entering the code we've sent you to";
        } else if (confirmationMethod === 'SMS') {
          this.anonymizedContact = anonymizePhoneNumber(registrationData.telephoneNumber);
          this.confirmationMessage = "Confirm your phone number by entering the code we've sent you to";
        } else {
          this.confirmationMessage = `Confirm your account by entering the code we've sent you via ${confirmationMethod}.`;
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

  activate() {
    if (this.activationForm.invalid) {
      return;
    }

    this.authService.activateUser(this.activationForm.controls['code'].value ?? '').subscribe({
      next: () => {
        this.reset();

        setTimeout(() => {
          this.toastService.success({
            detail: "Activation successful.",
            summary: " You can now log in using your credentials on login page :)",
            position: "tl",
            duration: 8000
          });
        }, 1000);
      },
      error: (error: CustomError) => {
        this.toastService.error({
          detail: "Error",
          position: "tl",
          summary: error.message,
          duration: 5000
        });
      }
    });
  }

  handleRecaptchaResponse(response: string) {
    this.recaptchaToken = response;
  }

  reset() {
    this.authForm.reset();
    this.moreInfoForm.reset();
    this.activationForm.reset();
    this.activeForm = ActiveForm.AUTH;
  }
}
