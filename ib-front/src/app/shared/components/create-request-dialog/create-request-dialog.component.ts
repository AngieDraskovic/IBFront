import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {isAfter, isValid, parse} from 'date-fns';
import {AuthService} from "../../../core/services/auth.service";
import {Role} from "../../../core/enums/role";
import {CertificateRequestService} from "../../../core/services/certificate-request.service";
import {CreateCertificateRequestDTO} from "../../interfaces/create-certificate-request-dto";
import {CertificateType} from "../../enums/certificate-type.enum";
import {CustomError} from "../../interfaces/custom-error";
import {getCertificateTypeLabel} from "../../utilities/certificate-type.util";

@Component({
  selector: 'app-create-request-dialog',
  templateUrl: './create-request-dialog.component.html',
  styleUrls: ['./create-request-dialog.component.css']
})
export class CreateRequestDialogComponent implements OnInit {
  protected readonly CertificateType = CertificateType;
  protected readonly getCertificateTypeLabel = getCertificateTypeLabel;

  hasErrors: boolean = false;
  error: string = "";

  menuOpen = false;
  options?: CertificateType[];
  selectedOption?: CertificateType;
  validToValue: string | undefined;
  issuerSNValue: string | undefined;

  constructor(private authService: AuthService,
              private certificateRequestService: CertificateRequestService,
              private dialogRef: MatDialogRef<CreateRequestDialogComponent>) {
  }

  ngOnInit(): void {
    this.fetchOptions();
  }

  fetchOptions(): void {
    if (this.authService.currentUserValue?.role == Role.User) {
      this.options = [CertificateType.INTERMEDIATE, CertificateType.END];
      this.selectedOption = this.options[0];
    } else if (this.authService.currentUserValue?.role == Role.Admin) {
      this.options = [CertificateType.ROOT, CertificateType.INTERMEDIATE, CertificateType.END];
      this.selectedOption = this.options[0];
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  selectOption(option: CertificateType): void {
    this.selectedOption = option;
    this.toggleMenu();
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

  createRequest() {
    const formattedDate: Date | null = this.formatDate(this.validToValue)

    if (formattedDate == null) {
      this.hasErrors = true;
      this.error = "Valid To is not in proper format or is not in future."
      return;
    }

    if (this.selectedOption == undefined) {
      return;
    }

    if (this.selectedOption != CertificateType.ROOT && (this.issuerSNValue == undefined || this.issuerSNValue.length == 0)) {
      this.hasErrors = true;
      this.error = "Issuer serial number must not be empty."
      return;
    }

    const createCertificateRequestDTO: CreateCertificateRequestDTO = {
      issuerSN: this.issuerSNValue,
      certificateType: this.selectedOption,
      validTo: formattedDate
    }

    if (this.authService.currentUserValue?.role == Role.Admin) {
      this.certificateRequestService.createAdminCertificateRequest(createCertificateRequestDTO).subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: (error: CustomError) => {
          this.hasErrors = true;
          this.error = error.message
        }
      })
    } else if (this.authService.currentUserValue?.role == Role.User) {
      this.certificateRequestService.createUserCertificateRequest(createCertificateRequestDTO).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error: CustomError) => {
          this.hasErrors = true;
          this.error = error.message
        }
      })
    }
  }

  formatDate(dateString: string | undefined): Date | null {
    if (dateString == undefined) {
      return null;
    }

    const format = 'dd-MM-yyyy';
    const parsedDate = parse(dateString, format, new Date());

    if (isValid(parsedDate) && isAfter(parsedDate, new Date())) {
      return parsedDate;
    } else {
      return null;
    }
  }
}
