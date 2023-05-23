import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {RegistrationData} from "../../models/registration-data";
import {NotificationService} from "../../services/notification.service";
import {AuthFormComponent} from "../../forms/auth-form/auth-form.component";
import {MoreInfoFormComponent} from "../../forms/more-info-form/more-info-form.component";
import {ActivationFormComponent} from "../../forms/activation-form/activation-form.component";
import {LoadingService} from "../../services/loading.service";

enum RegisterStep {
  AuthForm,
  MoreInfoForm,
  AccountActivationForm
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
  protected readonly RegisterStep = RegisterStep;
  @ViewChild(AuthFormComponent) authForm!: AuthFormComponent;
  @ViewChild(MoreInfoFormComponent) moreInfoForm!: MoreInfoFormComponent;
  @ViewChild(ActivationFormComponent) activationForm!: ActivationFormComponent;

  currentStep: RegisterStep = RegisterStep.AuthForm;
  animationType: AnimationType = AnimationType.SLIDE_IN_LEFT;

  authData: { email: string, password: string } | undefined;
  confirmationData: { confirmationMethod: 'Email' | 'SMS', contactDetail: string } | undefined;

  constructor(private authService: AuthService,
              public loadingService: LoadingService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

  nextStep(data: { email: string, password: string }) {
    this.authData = data;
    this.animationType = AnimationType.SLIDE_IN_RIGHT;
    this.currentStep = RegisterStep.MoreInfoForm;
  }

  previousStep() {
    if (this.currentStep > RegisterStep.AuthForm) {
      this.animationType = AnimationType.SLIDE_IN_LEFT;
      this.currentStep--;
    }
  }

  formCompleted(data: RegistrationData) {
    if (this.authData == undefined) {
      return;
    }

    const completeData: RegistrationData = {
      ...data,
      email: this.authData.email,
      password: this.authData.password
    };

    this.confirmationData = {
      confirmationMethod: completeData.confirmationMethod,
      contactDetail: completeData.email
    }

    this.loadingService.show();
    this.authService.register(completeData, completeData.confirmationMethod).subscribe({
      next: () => {
        this.loadingService.hide();
        this.authData = undefined;
        this.activationForm.updateView();
        this.currentStep = RegisterStep.AccountActivationForm;
      },
      error: () => {
        this.loadingService.hide();
        this.notificationService.showDefaultError('tl');
      }
    });
  }

  reset() {
    this.currentStep = RegisterStep.AuthForm;
    this.authData = undefined;
    this.confirmationData = undefined;
    this.authForm.reset();
    this.moreInfoForm.reset();
    this.activationForm.reset();
  }
}
