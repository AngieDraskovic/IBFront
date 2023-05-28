import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-confirmation-method-form',
  templateUrl: './confirmation-method-form.component.html',
  styleUrls: ['./confirmation-method-form.component.css']
})
export class ConfirmationMethodFormComponent implements OnInit{
  confirmationMethodForm = new FormGroup({
    confirmationMethod: new FormControl('', [Validators.required]),
  }, {});

  @Output() onBack = new EventEmitter<any>();
  @Output() onConfirmationMethodSubmit = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit(): void {
  }

  onFormSubmit() {
    if (this.confirmationMethodForm.valid) {
      this.onConfirmationMethodSubmit.emit(this.confirmationMethodForm.value['confirmationMethod']);
    }
  }

  reset() {
    this.confirmationMethodForm.reset();
  }

  navigateBack() {
    this.reset();
    this.onBack.emit();
  }
}
