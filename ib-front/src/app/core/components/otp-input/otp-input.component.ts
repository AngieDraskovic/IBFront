import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  Renderer2, ViewChild,
  ViewChildren
} from '@angular/core';

@Component({
  selector: 'app-otp-input',
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.css']
})
export class OtpInputComponent implements AfterViewInit {
  otp: string[] = ['', '', '', ''];
  enableInputs: boolean[] = [true, false, false, false];

  @ViewChildren('digit0, digit1, digit2, digit3') otpInputFields!: QueryList<ElementRef>;

  @ViewChild('digit0') digit0Input!: ElementRef;

  constructor() {
  }

  ngAfterViewInit() {
    console.log(this.digit0Input.nativeElement);
    this.digit0Input.nativeElement.focus();
  }

  onKey(event: KeyboardEvent, index: number) {
    const input = this.otp[index];

    if (event.key === "Backspace") {
      this.enableInputs[index] = false;
      this.otp[index] = '';

      if (index > 0) {
        this.otpInputFields.toArray()[index - 1].nativeElement.focus();
      }

      return;
    }

    if (input !== '' && input.toString().length >= 1) {
      if (index < this.otp.length - 1) {
        this.enableInputs[index + 1] = true;
        this.otpInputFields.toArray()[index + 1].nativeElement.focus();
      }
    }
  }

  verifyOTP() {
    if (this.otp.join('') === '1234') { // Replace '1234' with the actual OTP
      console.log('OTP is correct!');
    } else {
      console.log('OTP is incorrect!');
    }

    console.log(this.otp.join(''));
  }
}
