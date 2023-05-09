import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {SslCertificate} from "../../shared/interfaces/ssl-certificate";
import {handleSharedError} from "../../shared/utilities/shared-error-handler.util";
import {CertificateStatus} from "../../shared/enums/certificate-status.enum";
import {CertificateType} from "../../shared/enums/certificate-type.enum";
import {User} from "../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class SslCertificateService {
  private readonly apiUrl = `${environment.apiUrl}/certificate`;

  constructor(private http: HttpClient) {
  }

  getBySerialNumber(serialNumber: string): Observable<SslCertificate> {
    return this.http.get<SslCertificate>(`${this.apiUrl}/${serialNumber}`)
      .pipe(
        map((certificate: SslCertificate) => ({
          ...certificate,
          type: this.mapCertificateType(certificate.type),
          status: this.mapCertificateStatus(certificate.status),
        })),
        catchError(handleSharedError)
      );
  }

  getAllCertificates(): Observable<SslCertificate[]> {
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

  getCertificatesForUser(): Observable<SslCertificate[]> {
    return this.http.get<SslCertificate[]>(`${this.apiUrl}/owner`)
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

  getCertificatesIssuedByUser(): Observable<SslCertificate[]> {
    return this.http.get<SslCertificate[]>(`${this.apiUrl}/issued`)
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

  revokeCertificate(serialNumber: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${serialNumber}/revoke`, {});
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

  private mapCertificateStatus(status: string): CertificateStatus {
    switch (status) {
      case 'VALID':
        return CertificateStatus.VALID;
      case 'PENDING':
        return CertificateStatus.PENDING;
      case 'EXPIRED':
        return CertificateStatus.EXPIRED;
      case 'REVOKED':
        return CertificateStatus.REVOKED;
      default:
        throw new Error(`Unknown certificate status: ${status}`);
    }
  }
}
