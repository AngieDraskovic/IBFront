import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.css']
})
export class FormFieldComponent implements OnInit{
  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() type!: string;
  @Input() icon!: string;
  @Input() placeholder!: string;
  @Input() errorMessages!: { [key: string]: string };

  constructor() {
  }

  ngOnInit(): void {
  }

  isInvalidAndTouched() {
    const control = this.formGroup.get(this.controlName);
    return control && control.touched && control.invalid;
  }

  getErrorMessage() {
    const control = this.formGroup.get(this.controlName);

    if (control?.hasError('required')) {
      return 'Input cannot be empty';
    }

    if (control?.hasError('minlength')) {
      return 'Minimum length is ' + control.errors?.['minlength'].requiredLength;
    }

    for (const key in control?.errors) {
      if (this.errorMessages.hasOwnProperty(key)) {
        return this.errorMessages[key];
      }
    }

    return null;
  }
}
