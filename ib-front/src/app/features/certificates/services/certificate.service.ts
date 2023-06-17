import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {catchError, map, Observable} from "rxjs";
import {Certificate} from "../models/certificate";
import {handleSharedError} from "../../../core/utilities/shared-error-handler.util";
import {CertificateStatus} from "../enums/certificate-status.enum";
import {CertificateType} from "../enums/certificate-type.enum";
import {User} from "../../../core/models/user";
import {PaginatedResponse} from "../../../core/models/paginated-response";

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private readonly apiUrl = `${environment.apiUrl}/certificate`;

  constructor(private http: HttpClient) {
  }

  getBySerialNumber(serialNumber: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/${serialNumber}`)
      .pipe(
        map((certificate: Certificate) => ({
          ...certificate,
          type: this.mapCertificateType(certificate.type),
          status: this.mapCertificateStatus(certificate.status),
        })),
        catchError(handleSharedError)
      );
  }

  getAll(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(this.apiUrl)
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

  getAllPaged(page: number, size: number): Observable<PaginatedResponse<Certificate>> {
    const params = {
      page: page.toString(),
      size: size.toString()
    };

    return this.http.get<PaginatedResponse<Certificate>>(`${this.apiUrl}/paginated`, {params})
      .pipe(
        map(response => ({
          ...response,
          content: response.content.map((certificate: Certificate) => ({
            ...certificate,
            type: this.mapCertificateType(certificate.type),
            status: this.mapCertificateStatus(certificate.status),
          })),
        })),
        catchError(handleSharedError)
      );
  }

  getCertificatesForUser(page: number, size: number): Observable<PaginatedResponse<Certificate>> {
    const params = {
      page: page.toString(),
      size: size.toString()
    };

    return this.http.get<PaginatedResponse<Certificate>>(`${this.apiUrl}/owner`, {params})
      .pipe(
        map(response => ({
          ...response,
          content: response.content.map((certificate: Certificate) => ({
            ...certificate,
            type: this.mapCertificateType(certificate.type),
            status: this.mapCertificateStatus(certificate.status),
          })),
        })),
        catchError(handleSharedError)
      );
  }

  countAllCertificates(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/all`);
  }

  countCertificatesByStatus(status: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/status`, {params: {status}});
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
