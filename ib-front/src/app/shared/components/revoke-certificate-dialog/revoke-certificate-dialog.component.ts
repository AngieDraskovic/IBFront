import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {findIndex} from "rxjs";

@Component({
  selector: 'app-revoke-certificate-dialog',
  templateUrl: './revoke-certificate-dialog.component.html',
  styleUrls: ['./revoke-certificate-dialog.component.css']
})
export class RevokeCertificateDialogComponent {
  inputValue: string = "";

  constructor(public dialogRef: MatDialogRef<RevokeCertificateDialogComponent>) {
  }

  onFocus(input: HTMLInputElement | HTMLTextAreaElement) {
    const parent = input.parentNode as HTMLElement;
    parent.classList.add('focus');
    parent.classList.add('not-empty');
  }

  onBlur(input: HTMLInputElement | HTMLTextAreaElement) {
    const parent = input.parentNode as HTMLElement;
    if (input.value === '') {
      parent.classList.remove('not-empty');
    }
    parent.classList.remove('focus');
  }

  cancel() {
    this.dialogRef.close(false);
  }

  finish() {
    if (this.inputValue.length > 0) {
      this.dialogRef.close(true);
    }
  }
}
