import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {match} from "../../../shared/utilities/match.validator";
import {CustomError} from "../../models/custom-error";
import {AuthService} from "../../services/auth.service";
import {NotificationService} from "../../services/notification.service";
import {RegistrationData} from "../../models/registration-data";
import {LoadingService} from "../../services/loading.service";

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent implements OnInit {
  authForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required,])
  }, {validators: [match('password', 'confirmPassword')]});

  @Output() formCompleted = new EventEmitter<{ email: string, password: string }>();

  constructor(private authService: AuthService,
              private loadingService: LoadingService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      this.checkEmailExistsAndProceed(this.authForm.value['email'])
    }
  }

  checkEmailExistsAndProceed(email: string | null | undefined) {
    if (email == null) {
      return;
    }

    this.loadingService.show();
    this.authService.checkEmail(email).subscribe(
      {
        next: (emailExists) => {
          this.loadingService.hide();

          if (emailExists) {
            this.notificationService.showWarning("Email taken", "Email already in use", "tl");
          } else {
            const authData: { email: string, password: string } = {
              email: this.authForm.value['email']!,
              password: this.authForm.value['password']!
            }
            this.formCompleted.emit(authData);
          }
        },
        error: () => {
          this.loadingService.hide();
          this.notificationService.showDefaultError('tl');
        }
      }
    );
  }

  reset() {
    this.authForm.reset();
  }
}
