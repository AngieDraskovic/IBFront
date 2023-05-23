import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RegistrationData} from "../../models/registration-data";
import {Home} from "../../components/home/home";
import {AuthService} from "../../services/auth.service";
import {NotificationService} from "../../services/notification.service";

@Component({
  selector: 'app-more-info-form',
  templateUrl: './more-info-form.component.html',
  styleUrls: ['./more-info-form.component.css']
})
export class MoreInfoFormComponent implements OnInit {
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

  @Output() formCompleted = new EventEmitter<any>();
  @Output() goBack = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
  }

  register() {
    if (this.moreInfoForm.invalid) {
      return;
    }

    const registrationData = {
      name: this.moreInfoForm.controls['name'].value ?? '',
      surname: this.moreInfoForm.controls['surname'].value ?? '',
      telephoneNumber: this.moreInfoForm.controls['telephoneNumber'].value ?? '',
      confirmationMethod: this.moreInfoForm.controls['confirmationMethod'].value ?? '',
      recaptchaToken: this.recaptchaToken
    }

    this.formCompleted.emit(registrationData);
  }

  handleRecaptchaResponse(response: string) {
    this.recaptchaToken = response;
  }

  onBack() {
    this.goBack.emit();
  }

  reset() {
    this.moreInfoForm.reset();
  }
}
