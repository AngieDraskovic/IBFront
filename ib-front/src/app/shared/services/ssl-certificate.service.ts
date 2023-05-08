import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {SslCertificate} from "../interfaces/ssl-certificate";
import {handleSharedError} from "../utilities/shared-error-handler";
import {CertificateStatus} from "../enums/certificate-status.enum";
import {CertificateType} from "../enums/certificate-type.enum";

@Injectable({
  providedIn: 'root'
})
export class SslCertificateService {
  private readonly apiUrl = `${environment.apiUrl}/certificate`;

  constructor(private http: HttpClient) {
  }

  getCertificates(): Observable<SslCertificate[]> {
    return this.http.get<SslCertificate[]>(this.apiUrl)
      .pipe(
        map((certificates: any[]) =>
          certificates.map(certificate => ({
            ...certificate,
            type: this.mapCertificateType(certificate.type),
            status: this.mapCertificateStatus(certificate.status),
          }))
        ),
        catchError(handleSharedError)
      );
  }

  validateCertificateSerialNumber(serialNumber: string) {
    return this.http.get(`${this.apiUrl}/${serialNumber}/validate`)
      .pipe(
        catchError(handleSharedError)
      );
  }

  validateCertificateCopy(file: File): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      }),
      observe: 'response' as 'response'
    };

    return this.http.post<HttpResponse<any>>(`${this.apiUrl}/validateCopy`, formData, httpOptions)
      .pipe(
        catchError(handleSharedError)
      );
    ;
  }

  downloadCertificate(certificateSN: string): Observable<Blob> {
    const url = `${this.apiUrl}/${certificateSN}/download`;
    return this.http.get(url, {responseType: 'blob'});
  }

  private mapCertificateType(dtoType: string): CertificateType {
    switch (dtoType) {
      case 'ROOT':
        return CertificateType.ROOT;
      case 'INTERMEDIATE':
        return CertificateType.INTERMEDIATE;
      case 'END':
        return CertificateType.END;
      default:
        throw new Error(`Unknown certificate type: ${dtoType}`);
    }
  }

  private mapCertificateStatus(dtoStatus: string): CertificateStatus {
    switch (dtoStatus) {
      case 'VALID':
        return CertificateStatus.VALID;
      case 'PENDING':
        return CertificateStatus.PENDING;
      case 'EXPIRED':
        return CertificateStatus.EXPIRED;
      case 'REVOKED':
        return CertificateStatus.REVOKED;
      default:
        throw new Error(`Unknown certificate status: ${dtoStatus}`);
    }
  }
}
