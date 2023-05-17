import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {isAfter, isValid, parse} from 'date-fns';
import {AuthService} from "../../../../core/services/auth.service";
import {UserRoleEnum} from "../../../../core/enums/user-role.enum";
import {CertificateRequestService} from "../../services/certificate-request.service";
import {CreateCertificateRequestDTO} from "../../models/create-certificate-request-dto";
import {CertificateType} from "../../../certificates/enums/certificate-type.enum";
import {CustomError} from "../../../../core/models/custom-error";
import {getCertificateTypeLabel} from "../../../../shared/utilities/certificate-type.util";

@Component({
  selector: 'app-create-request-dialog',
  templateUrl: './create-certificate-request-dialog.component.html',
  styleUrls: ['./create-certificate-request-dialog.component.css']
})
export class CreateCertificateRequestDialogComponent implements OnInit {
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
              private dialogRef: MatDialogRef<CreateCertificateRequestDialogComponent>) {
  }

  ngOnInit(): void {
    this.fetchOptions();
  }

  fetchOptions(): void {
    if (this.authService.currentUserValue?.role == UserRoleEnum.User) {
      this.options = [CertificateType.INTERMEDIATE, CertificateType.END];
      this.selectedOption = this.options[0];
    } else if (this.authService.currentUserValue?.role == UserRoleEnum.Admin) {
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

    if (this.authService.currentUserValue?.role == UserRoleEnum.Admin) {
      this.certificateRequestService.createAdminCertificateRequest(createCertificateRequestDTO).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error: CustomError) => {
          this.hasErrors = true;
          this.error = error.message
        }
      })
    } else if (this.authService.currentUserValue?.role == UserRoleEnum.User) {
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
