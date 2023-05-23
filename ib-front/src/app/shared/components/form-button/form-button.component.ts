import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-form-button',
  templateUrl: './form-button.component.html',
  styleUrls: ['./form-button.component.css']
})
export class FormButtonComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() buttonText!: string;
  @Output() onSubmit = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
  }

  submitForm() {
    if (this.formGroup.valid) {
      this.onSubmit.emit();
    }
  }
}
