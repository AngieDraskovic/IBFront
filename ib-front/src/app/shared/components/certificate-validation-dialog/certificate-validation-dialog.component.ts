import {Component} from '@angular/core';
import {SslCertificateService} from "../../../core/services/ssl-certificate.service";
import {CustomError} from "../../interfaces/custom-error";

@Component({
  selector: 'app-certificate-validation-dialog',
  templateUrl: './certificate-validation-dialog.component.html',
  styleUrls: ['./certificate-validation-dialog.component.css']
})
export class CertificateValidationDialogComponent {
  message: string = "";
  slideInLeftFirst: boolean = false;
  slideInLeftSecond: boolean = false;

  constructor(private certificateService: SslCertificateService) {
  }

  reset(): void {
    this.slideInLeftFirst = false;
    this.slideInLeftSecond = false;
    this.message = "";
  }

  showFirst(message: string) {
    this.message = message;
    this.slideInLeftFirst = true;
  }

  showSecond(message: string) {
    this.message = message;
    this.slideInLeftSecond = true;
  }

  validateCert(certificateSN: string) {
    this.reset();
    setTimeout(() => {
      if (certificateSN.length == 0) {
        this.showSecond("You must enter SN");
      } else {
        this.certificateService.validateCertificateSerialNumber(certificateSN).subscribe({
          next: () => {
            this.showFirst("Certificate with SN: " + certificateSN + " is valid")
          },
          error: (error: CustomError) => {
            this.showSecond("Certificate is not valid.")
          }
        });
      }
    }, 200)
  }

  onFileSelected($event: Event) {
    this.reset();
    if (event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        let selectedFile = target.files[0];

        if (selectedFile) {
          this.certificateService.validateCertificateCopy(selectedFile).subscribe({
            next: () => {
              this.showFirst("Uploaded certificate is valid")
            },
            error: (error: CustomError) => {
              this.showSecond("Uploaded certificate is not valid.")
            }
          });
        } else {
          this.showSecond("File is invalid.")
        }
      }
    }
  }
}
