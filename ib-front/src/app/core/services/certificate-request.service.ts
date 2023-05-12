import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CertificateRequest} from "../../shared/interfaces/certificate-request";
import {catchError, forkJoin, map, Observable, of, switchMap} from "rxjs";
import {CertificateRequestStatus} from "../../shared/enums/certificate-request-status.enum";
import {handleSharedError} from "../../shared/utilities/shared-error-handler.util";
import {CreateCertificateRequestDTO} from "../../shared/interfaces/create-certificate-request-dto";
import {format} from "date-fns";
import {CertificateService} from "./certificate.service";
import {OutgoingCertificateRequest} from "../../shared/interfaces/outgoing-certificate-request";
import {RejectionReason} from "../../shared/interfaces/rejection-reason";

@Injectable({
  providedIn: 'root'
})
export class CertificateRequestService {
  private readonly apiUrl = `${environment.apiUrl}/certificate/request`;

  constructor(private http: HttpClient, private certificateService: CertificateService) {
  }

  getAllCertificateRequests(): Observable<CertificateRequest[]> {
    return this.http.get<CertificateRequest[]>(this.apiUrl)
      .pipe(
        map((requests: any[]) =>
          requests.map(request => ({
            ...request,
            status: this.mapCertificateRequestStatus(request.status),
          }))
        ),
        catchError(handleSharedError)
      );
  }

  getOutgoingCertificateRequests(): Observable<OutgoingCertificateRequest[]> {
    return this.http.get<OutgoingCertificateRequest[]>(`${this.apiUrl}/outgoing-requests`)
      .pipe(switchMap((requests: OutgoingCertificateRequest[]) => {
          if (requests.length === 0) {
            return of([]);
          }

          const requestObservables = requests.map(request =>
            this.certificateService.getBySerialNumber(request.issuerSN)
              .pipe(
                map(issuerCertificate => ({
                  ...request,
                  issuerUsername: issuerCertificate.userEmail,
                  status: this.mapCertificateRequestStatus(request.status),
                }))
              )
          );

          return forkJoin(requestObservables);
        }),
        catchError(handleSharedError)
      );
  }

  getIncomingCertificateRequests(): Observable<CertificateRequest[]> {
    return this.http.get<CertificateRequest[]>(`${this.apiUrl}/pending-incoming-requests`)
      .pipe(
        map((requests: any[]) =>
          requests.map(request => ({
            ...request,
            status: this.mapCertificateRequestStatus(request.status),
          }))
        ),
        catchError(handleSharedError)
      );
  }

  createUserCertificateRequest(certificateRequestDTO: CreateCertificateRequestDTO): Observable<any> {
    const formattedCertificateRequestDTO = {
      ...certificateRequestDTO,
      validTo: format(certificateRequestDTO.validTo, 'yyyy-MM-dd'),
    };

    return this.http.post(`${this.apiUrl}/create-user`, formattedCertificateRequestDTO)
      .pipe(
        catchError(handleSharedError)
      );
  }

  approveCertificateRequest(requestId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${requestId}/approve`, {})
      .pipe(
        catchError(handleSharedError)
      );
  }

  rejectCertificateRequest(requestId: string, rejectionReason: RejectionReason): Observable<void> {
    const url = `${this.apiUrl}/${requestId}/reject`;
    return this.http.put<void>(url, rejectionReason)
      .pipe(
        catchError(handleSharedError)
      );
  }

  createAdminCertificateRequest(certificateRequestDTO: CreateCertificateRequestDTO): Observable<any> {
    const formattedCertificateRequestDTO = {
      ...certificateRequestDTO,
      validTo: format(certificateRequestDTO.validTo, 'yyyy-MM-dd'),
    };

    return this.http.post(`${this.apiUrl}/create-admin`, formattedCertificateRequestDTO)
      .pipe(
        catchError(handleSharedError)
      );
  }


  private mapCertificateRequestStatus(status: string): CertificateRequestStatus {
    switch (status) {
      case 'PENDING':
        return CertificateRequestStatus.PENDING;
      case 'APPROVED':
        return CertificateRequestStatus.APPROVED;
      case 'REJECTED':
        return CertificateRequestStatus.REJECTED;
      default:
        throw new Error(`Unknown certificate request status: ${status}`);
    }
  }
}
