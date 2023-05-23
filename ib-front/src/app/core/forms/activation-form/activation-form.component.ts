import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {NotificationService} from "../../services/notification.service";
import {anonymizeEmail, anonymizePhoneNumber} from "../../../shared/utilities/anonymizer.util";
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-activation-form',
  templateUrl: './activation-form.component.html',
  styleUrls: ['./activation-form.component.css']
})
export class ActivationFormComponent implements OnInit {
  activationForm = new FormGroup({
    code: new FormControl('', [Validators.required])
  }, {});

  @Input() confirmationData: { confirmationMethod: 'Email' | 'SMS', contactDetail: string } | undefined;
  @Output() onActivated = new EventEmitter<any>();
  anonymizedContact!: string;
  confirmationMessage!: string;

  constructor(private authService: AuthService,
              private loadingService: LoadingService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

  updateView() {
    if (this.confirmationData == null) {
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

  activate() {
    if (this.activationForm.invalid) {
      return;
    }

    this.loadingService.show();
    this.authService.activateUser(this.activationForm.controls['code'].value ?? '').subscribe({
      next: () => {
        this.loadingService.hide();
        this.onActivated.emit();

        setTimeout(() => {
          this.notificationService.showSuccess(
            "Activation successful",
            "You can now log in using your credentials on login page :)",
            'tl');
        }, 1000);
      },
      error: () => {
        this.loadingService.hide();
        this.notificationService.showDefaultError('tl');
      }
    });
  }

  reset() {
    this.activationForm.reset();
  }
}
