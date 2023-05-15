import {Injectable} from '@angular/core';
import {CertificateService} from "./certificate.service";
import {NgToastService} from "ng-angular-popup";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class CertificateDownloadService {
  private readonly apiUrl = `${environment.apiUrl}/certificate`;

  constructor(
    private http: HttpClient,
    private certificateService: CertificateService,
    private toastService: NgToastService) {
  }

  downloadCertificate(certificateSN: string): void {
    const url = `${this.apiUrl}/${certificateSN}/download-certificate`;

    this.http.get(url, {responseType: 'blob'}).subscribe({
      next: (data) => {
        const blob = new Blob([data], {type: 'application/x-pem-file'});
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `certificate_${certificateSN}.pem`;
        link.click();

        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.toastService.error({
          detail: "Error",
          summary: "Error while downloading private key.",
          duration: 5000
        });
      }
    });
  }

  downloadPrivateKey(certificateSN: string): void {
    const url = `${this.apiUrl}/${certificateSN}/download-private-key`;

    this.http.get(url, {responseType: 'blob'}).subscribe({
      next: (data) => {
        const blob = new Blob([data], {type: 'application/x-pem-file'});
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `key_${certificateSN}.key`;
        link.click();

        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.toastService.error({
          detail: "Error",
          summary: "Error while downloading private key.",
          duration: 5000
        });
      }
    });
  }
}
