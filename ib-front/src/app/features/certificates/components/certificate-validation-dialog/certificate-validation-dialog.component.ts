import {Component} from '@angular/core';
import {CertificateService} from "../../services/certificate.service";
import {CustomError} from "../../../../core/models/custom-error";
import {MatDialogRef} from "@angular/material/dialog";
import {LoadingService} from "../../../../core/services/loading.service";

@Component({
  selector: 'app-certificate-validation-dialog',
  templateUrl: './certificate-validation-dialog.component.html',
  styleUrls: ['./certificate-validation-dialog.component.css']
})
export class CertificateValidationDialogComponent {
  message: string = "";
  slideInLeftFirst: boolean = false;
  slideInLeftSecond: boolean = false;

  constructor(private certificateService: CertificateService,
              private matDialogRef: MatDialogRef<CertificateValidationDialogComponent>,
              public loadingService: LoadingService) {
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

    this.loadingService.show();
    setTimeout(() => {
      if (certificateSN.length == 0) {
        this.loadingService.hide();
        this.showSecond("You must enter SN");
      } else {
        this.certificateService.validateCertificateSerialNumber(certificateSN).subscribe({
          next: () => {
            this.loadingService.hide();
            this.showFirst("Certificate with SN: " + certificateSN + " is valid")
          },
          error: (error: CustomError) => {
            this.loadingService.hide();
            this.showSecond("Certificate is not valid.")
          }
        });
      }
    }, 500)
  }

  onFileSelected($event: Event) {
    this.reset();
    if (event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        let selectedFile = target.files[0];

        if (selectedFile) {
          if (!this.validateFile(selectedFile)) {
            return;
          }

          this.loadingService.show();
          setTimeout(() => {
            this.certificateService.validateCertificateCopy(selectedFile).subscribe({
              next: () => {
                this.loadingService.hide();
                this.showFirst("Uploaded certificate is valid")
              },
              error: (error: CustomError) => {
                this.loadingService.hide();
                if (error.status == 401) {
                  this.matDialogRef.close();
                } else {
                  this.showSecond("Uploaded certificate is not valid.")
                }
              }
            });
          }, 500)
        } else {
          this.showSecond("File is invalid.")
        }
      }
    }
  }

  validateFile(file: File): boolean {
    let MAX_FILE_SIZE = 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      this.showSecond("File is too large. Maximum size is 1MB.");
      return false;
    }

    let acceptableFileTypes = ["application/x-x509-ca-cert", "application/x-pem-file", "application/pkix-cert"];
    if (!acceptableFileTypes.includes(file.type)) {
      this.showSecond("Invalid file type.");
      return false;
    }

    return true;
  }
}
