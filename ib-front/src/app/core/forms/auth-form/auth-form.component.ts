import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {match} from "../../../shared/utilities/match.validator";
import {CustomError} from "../../models/custom-error";
import {AuthService} from "../../services/auth.service";
import {NotificationService} from "../../services/notification.service";
import {RegistrationData} from "../../models/registration-data";
import {LoadingService} from "../../services/loading.service";
import {UserService} from "../../services/user.service";
import {Credentials} from "../../models/credentials";
import {Subject, takeUntil} from "rxjs";
import {SharedDataService} from "../../services/shared-data.service";

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required,])
  }, {validators: [match('password', 'confirmPassword')]});

  @Output() onAuthSubmit = new EventEmitter<void>();
  @Output() accountActivationNavigate = new EventEmitter<void>();


  constructor(private loadingService: LoadingService,
              private userService: UserService,
              private sharedService: SharedDataService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

  onFormSubmit() {
    if (this.authForm.invalid) {
      return
    }

    const authData = {
      email: this.authForm.controls['email'].value ?? '',
      password: this.authForm.controls['password'].value ?? '',
    }

    this.loadingService.show();
    this.userService.doesEmailExist(authData.email)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        {
          next: (emailExists) => {
            this.loadingService.hide();

            if (emailExists) {
              this.notificationService.showWarning("Email taken", "Email already in use", "tl");
            } else {
              this.sharedService.setAuthData(authData);
              this.onAuthSubmit.emit();
            }
          },
          error: () => {
            this.loadingService.hide();
            this.notificationService.showDefaultError('tl');
          }
        }
      );
  }

  navigateOnAccountActivation() {
    this.accountActivationNavigate.emit();
  }

  reset() {
    this.authForm.reset();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
