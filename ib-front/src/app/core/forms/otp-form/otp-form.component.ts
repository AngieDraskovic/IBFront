import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter, Input, isDevMode, Output,
  QueryList,
  ViewChildren
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR, ValidationErrors,
  Validator, Validators
} from "@angular/forms";

function getFormArray(size: number): FormArray {
  const arr = [];

  for (let i = 0; i < size; i++) {
    arr.push(new FormControl('', Validators.required));
  }

  return new FormArray(arr);
}

@Component({
  selector: 'app-otp-form',
  templateUrl: './otp-form.component.html',
  styleUrls: ['./otp-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: OtpFormComponent,
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: OtpFormComponent,
      multi: true,
    },
  ],
})
export class OtpFormComponent implements AfterViewInit, ControlValueAccessor, Validator {
  @Input()
  set size(size: number) {
    this.inputs = getFormArray(size);
    this.#size = size;
  }

  @Output() onBack = new EventEmitter<any>();
  @Output() onOtpSubmit = new EventEmitter<string>();

  @ViewChildren('inputEl') inputEls!: QueryList<ElementRef<HTMLInputElement>>;

  #size = 4;
  #scheduledFocus: number | null = null;

  inputs = getFormArray(this.#size);

  onChange?: (value: string) => void;
  onTouched?: () => void;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.inputEls.get(0)?.nativeElement.focus();
  }

  writeValue(value: string): void {
    if (isDevMode() && value?.length) {
      throw new Error('Otp input is not supposed to be prefilled with data');
    }

    // Reset all input values
    this.inputs.setValue(new Array(this.#size).fill(''));
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.inputs.disable();
    } else {
      this.inputs.enable();
    }
  }

  validate(control: AbstractControl<string, string>): ValidationErrors | null {
    if (!control.value || control.value.length < this.#size) {
      return {
        otpInput: 'Value is incorrect',
      };
    }

    return null;
  }

  handleKeyDown(e: KeyboardEvent, idx: number) {
    if (e.key === 'Backspace' || e.key === 'Delete') {
      if (idx > 0) {
        this.#scheduledFocus = idx - 1;
      }
    }
  }

  // Due to iOS/iPadOS Safari bug/special behavior we are forced to
  // schedule focus transition during keypress/keydown event and only
  // after input event happened - execute the transition
  // otherwise inputs don't get their values filled
  handleInput() {
    this.#updateWiredValue();

    if (this.#scheduledFocus != null) {
      this.#focusInput(this.#scheduledFocus);
      this.#scheduledFocus = null;
    }
  }

  handleKeyPress(e: KeyboardEvent, idx: number) {
    const isDigit = /\d/.test(e.key);

    // Safari fires Cmd + V through keyPress event as well
    // so we need to handle it here and let it through
    if (e.key === 'v' && e.metaKey) {
      return true;
    }

    if (isDigit && idx + 1 < this.#size) {
      // If user inputs digits & we are not on the last input we want
      // to advance the focus
      this.#scheduledFocus = idx + 1;
    }

    if (isDigit && this.inputs.controls[idx].value) {
      // If user deselects an input which already has a value
      // we want to clear it so that it doesn't have more than 1 digit
      this.inputs.controls[idx].setValue('');
    }

    return isDigit;
  }

  handlePaste(e: ClipboardEvent, idx: number) {
    e.preventDefault();

    if (this.onTouched == null) {
      return;
    }

    if (idx !== 0) {
      // If the target input is not the first one - ignore
      return;
    }

    const pasteData = e.clipboardData?.getData('text');
    const regex = new RegExp(`\\d{${this.#size}}`);

    if (!pasteData || !regex.test(pasteData)) {
      // If there is nothing to be pasted or the pasted data does not
      // comply with the required format - ignore the event
      return;
    }

    for (let i = 0; i < pasteData.length; i++) {
      this.inputs.controls[i].setValue(pasteData[i]);
    }

    this.#focusInput(this.inputEls.length - 1);
    this.#updateWiredValue();
    this.onTouched();
  }

  handleFocus(e: FocusEvent) {
    // Select previously entered value to replace with a new input
    (e.target as HTMLInputElement).select();
  }

  #focusInput(idx: number) {
    // In order not to interfere with the input we setTimeout
    // before advancing the focus
    setTimeout(() => this.inputEls.get(idx)?.nativeElement.focus());
  }

  #updateWiredValue() {
    // We want to expose the value as a plain string
    //
    // In order not to interfere with the input we setTimeout
    // before advancing the focus
    setTimeout(() => this.onChange?.(this.inputs.value.join('')));
  }

  onFormSubmit() {
    this.onOtpSubmit.emit(this.inputs.value.join(''));
  }

  reset() {
    this.inputs.reset();
  }

  navigateBack() {
    this.reset();
    this.onBack.emit();
  }
}
