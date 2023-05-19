import {AfterViewInit, Component} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {Credentials} from "../../models/credentials";
import {CustomError} from "../../models/custom-error";
import {RegistrationData} from "../../models/registration-data";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {UserRoleEnum} from "../../enums/user-role.enum";
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-login-registration',
  templateUrl: './login-registration.component.html',
  styleUrls: ['./login-registration.component.css']
})
export class LoginRegistrationComponent {
  siteKey = '6Le54BwmAAAAAO5Wppw-q7bP4I1rKwZoZ1c_fWyV';
  recaptchaToken:string = '';
  signupMode = false;

  allTextPattern = "[a-zA-Z][a-zA-Z]*";
  phoneNumberPattern = "[0-9 +]?[0-9]+[0-9 \\-]+";

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required]),
    recaptcha: new FormControl('', [Validators.required])
  });

  signupForm = new FormGroup({
    name: new FormControl('', [Validators.pattern(this.allTextPattern), Validators.required]),
    surname: new FormControl('', [Validators.pattern(this.allTextPattern), Validators.required]),
    phoneNumber: new FormControl('', [Validators.pattern(this.phoneNumberPattern), Validators.minLength(6), Validators.maxLength(20), Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    confirmationMethod: new FormControl('sms'),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required])
  }, {validators: [match('password', 'confirmPassword')]});

  constructor(private authService: AuthService, private toastService: NgToastService,
              private router: Router) {
  }

  handleRecaptchaResponse(response: string) {
    console.log(response); 
    this.recaptchaToken = response;
  }

  
  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const credentials: Credentials = {
      email: this.loginForm.controls['email'].value ?? '',
      password: this.loginForm.controls['password'].value ?? '',
      recaptchaToken: this.recaptchaToken
    };
    window.alert("cao");
    console.log(credentials);

    this.authService.login(credentials).subscribe({
      next: () => {
        const user = this.authService.currentUserValue;
        if (user?.role === UserRoleEnum.Admin) {
          this.router.navigate(['/admin']);
        } else if (user?.role === UserRoleEnum.User) {
          this.router.navigate(['/user']);
        }
      },
      error: (error: CustomError) => {
        if (error.status == 401 || error.status == 403) {
          this.toastService.warning({
            detail: "Warning",
            summary: error.message,
            duration: 5000
          });
        } else {
          this.toastService.error({
            detail: "Error",
            summary: "Something went wrong.",
            duration: 5000
          });
        }
      }
    });
  }

  register() {
    if (this.signupForm.invalid) {
      return;
    }

    const registrationData: RegistrationData = {
      name: this.signupForm.controls['name'].value ?? '',
      surname: this.signupForm.controls['surname'].value ?? '',
      email: this.signupForm.controls['email'].value ?? '',
      phoneNumber: this.signupForm.controls['phoneNumber'].value ?? '',
      password: this.signupForm.controls['password'].value ?? '',
    };

    this.authService.register(registrationData, this.signupForm.controls['confirmationMethod'].value ?? '').subscribe({
      next: () => {
        this.toastService.success({
          detail: "Registration successful",
          summary: "Please activate your account via email and proceed to log in.",
          position: "tl",
          duration: 5000
        });
      },
      error: (error: CustomError) => {
        if (error.status == 409) {
          this.toastService.warning({
            detail: "Warning",
            summary: error.message,
            position: "tl",
            duration: 5000
          });
        } else {
          this.toastService.error({
            detail: "Error",
            summary: "Something went wrong.",
            position: "tl",
            duration: 5000
          });
        }
      }
    });
  }
}

function match(controlName: string, checkControlName: string): ValidatorFn {
  return (controls: AbstractControl) => {
    const control = controls.get(controlName);
    const checkControl = controls.get(checkControlName);

    if (checkControl?.errors && !checkControl.errors['matching']) {
      return null;
    }

    if (control?.value !== checkControl?.value) {
      controls.get(checkControlName)?.setErrors({matching: true});
      return {matching: true};
    } else {
      return null;
    }
  };
}
