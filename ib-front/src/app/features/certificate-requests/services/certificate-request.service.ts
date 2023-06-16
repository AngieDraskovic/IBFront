import {Injectable} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {CertificateRequest} from "../models/certificate-request";
import {catchError, forkJoin, map, Observable, of, switchMap} from "rxjs";
import {CertificateRequestStatus} from "../enums/certificate-request-status.enum";
import {handleSharedError} from "../../../core/utilities/shared-error-handler.util";
import {CreateCertificateRequestDTO} from "../models/create-certificate-request-dto";
import {format} from "date-fns";
import {CertificateService} from "../../certificates/services/certificate.service";
import {OutgoingCertificateRequest} from "../models/outgoing-certificate-request";
import {RejectionReason} from "../../../core/models/rejection-reason";
import {PaginatedResponse} from "../../../core/models/paginated-response";
import {CertificateType} from "../../certificates/enums/certificate-type.enum";

@Injectable({
  providedIn: 'root'
})
export class CertificateRequestService {
  private readonly apiUrl = `${environment.apiUrl}/certificate/request`;

  constructor(private http: HttpClient,
              private certificateService: CertificateService) {
  }

  getAllCertificateRequests(page: number, size: number): Observable<PaginatedResponse<CertificateRequest>> {
    const params = {
      page: page.toString(),
      size: size.toString()
    };

    return this.http.get<PaginatedResponse<CertificateRequest>>(this.apiUrl, {params})
      .pipe(
        map(response => ({
          ...response,
          content: response.content.map((certificateRequest: CertificateRequest) => ({
            ...certificateRequest,
            certificateType: this.mapCertificateType(certificateRequest.certificateType),
            status: this.mapCertificateRequestStatus(certificateRequest.status),
          })),
        })),
        catchError(handleSharedError)
      );
  }

  getOutgoingCertificateRequests(page: number, size: number): Observable<PaginatedResponse<OutgoingCertificateRequest>> {
    const params = {
      page: page.toString(),
      size: size.toString()
    };

    return this.http.get<PaginatedResponse<CertificateRequest>>(`${this.apiUrl}/outgoing-requests`, {params})
      .pipe(
        switchMap((certificateRequests: PaginatedResponse<CertificateRequest>) => {
          if (certificateRequests.content.length === 0) {
            return of({content: [], totalElements: 0, totalPages: 0});
          }

          const requestObservables = certificateRequests.content.map(certificateRequest => {
            if (certificateRequest.issuerSN === null) {
              return of({
                ...certificateRequest,
                issuerUsername: certificateRequest.subjectUsername,
                certificateType: this.mapCertificateType(certificateRequest.certificateType),
                status: this.mapCertificateRequestStatus(certificateRequest.status),
              });
            } else {
              return this.certificateService.getBySerialNumber(certificateRequest.issuerSN)
                .pipe(
                  map(issuerCertificate => ({
                    ...certificateRequest,
                    issuerUsername: issuerCertificate.userEmail,
                    certificateType: this.mapCertificateType(certificateRequest.certificateType),
                    status: this.mapCertificateRequestStatus(certificateRequest.status),
                  }))
                );
            }
          });

          return forkJoin(requestObservables)
            .pipe(
              map(content => ({
                content,
                totalElements: certificateRequests.totalElements,
                totalPages: certificateRequests.totalPages,
              })),
              catchError(handleSharedError)
            );
        }),
        catchError(handleSharedError)
      );
  }

  getIncomingCertificateRequests(page: number, size: number): Observable<PaginatedResponse<CertificateRequest>> {
    const params = {
      page: page.toString(),
      size: size.toString()
    };

    return this.http.get<PaginatedResponse<CertificateRequest>>(`${this.apiUrl}/pending-incoming-requests`, {params})
      .pipe(
        map(response => ({
          ...response,
          content: response.content.map((certificateRequest: CertificateRequest) => ({
            ...certificateRequest,
            certificateType: this.mapCertificateType(certificateRequest.certificateType),
            status: this.mapCertificateRequestStatus(certificateRequest.status),
          })),
        })),
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

  countAllCertificateRequests(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/all`);
  }

  countAllCertificateRequestsByUser(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/user`);
  }

  countCertificateRequestsByStatus(status: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/status`, {params: {status}});
  }

  countCertificateRequestsByStatusAndUser(status: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/user-status`, {params: {status}});
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
}
