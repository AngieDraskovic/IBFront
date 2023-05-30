import {Component, OnInit, ViewChild} from '@angular/core';
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
  animationType: AnimationType = AnimationType.SLIDE_IN_RIGHT;

  constructor(
    public loadingService: LoadingService) {
  }

  ngOnInit(): void {
  }

  accountActivationNavigate() {
    this.animationType = AnimationType.SLIDE_IN_RIGHT;
    this.currentStep = RegisterStep.AccountActivationForm;
  }

  nextStep() {
    this.animationType = AnimationType.SLIDE_IN_RIGHT;
    switch (this.currentStep) {
      case RegisterStep.AuthForm:
        this.currentStep = RegisterStep.MoreInfoForm;
        this.authForm.reset();
        break;
      case RegisterStep.MoreInfoForm:
        this.currentStep = RegisterStep.AccountActivationForm;
        this.moreInfoForm.reset();
        break;
      case RegisterStep.AccountActivationForm:
        this.currentStep = RegisterStep.AuthForm;
        this.activationForm.reset();
        break;
    }
  }

  onBack() {
    this.animationType = AnimationType.SLIDE_IN_LEFT;

    switch (this.currentStep) {
      case RegisterStep.MoreInfoForm:
        this.currentStep = RegisterStep.AuthForm;
        break;
      case RegisterStep.AccountActivationForm:
        this.currentStep = RegisterStep.AuthForm;
        break;
    }
  }
}
